// Notificador: lê a agenda que o app grava no Firestore e envia os avisos que venceram
// para todos os celulares registrados (Firebase Cloud Messaging).
// Sem dependências: roda no Cloudflare Workers e no Node 18+ (fetch + WebCrypto).

const MAX_LATE_MS = 20 * 60 * 1000; // aviso atrasado mais que isso é descartado (ex.: servidor parado)

const b64url = buf => {
  const bytes = typeof buf === 'string' ? new TextEncoder().encode(buf) : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export async function googleToken(sa, fetchFn = fetch) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${claim}`));
  const r = await fetchFn('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${head}.${claim}.${b64url(sig)}`,
  });
  if (!r.ok) throw new Error(`token Google: ${r.status} ${await r.text()}`);
  return (await r.json()).access_token;
}

// Decide quais avisos vencidos vão para cada celular. Função pura (testável).
export function plan({ events, tokens, done = {}, last, now }) {
  const from = Math.max(last || now - 2 * 60 * 1000, now - MAX_LATE_MS);
  const due = events.filter(e => e.ts > from && e.ts <= now && !done[e.skip || e.k]);
  const out = [];
  for (const e of due) for (const t of tokens) {
    // "meus": só avisos da casa (w == null) e os da própria pessoa.
    if (t.pref === 'meus' && e.w != null && String(e.w) !== String(t.who)) continue;
    out.push({ token: t.token, id: t.id, e });
  }
  return { due, sends: out };
}

const str = f => f && (f.stringValue ?? (f.integerValue != null ? String(f.integerValue) : undefined));

export async function run(env, opts = {}) {
  const fetchFn = opts.fetch || fetch;
  const now = opts.now || Date.now();
  if (!env.FIREBASE_SERVICE_ACCOUNT) throw new Error('Defina o segredo FIREBASE_SERVICE_ACCOUNT (JSON da conta de serviço).');
  const sa = typeof env.FIREBASE_SERVICE_ACCOUNT === 'string' ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT) : env.FIREBASE_SERVICE_ACCOUNT;
  const project = sa.project_id;
  const tok = await googleToken(sa, fetchFn);
  const H = { Authorization: `Bearer ${tok}`, 'content-type': 'application/json' };
  const base = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`;
  const get = async p => {
    const r = await fetchFn(`${base}/${p}`, { headers: H });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Firestore GET ${p}: ${r.status} ${await r.text()}`);
    return r.json();
  };

  const [ag, envio, plano, teste, tl] = await Promise.all([
    get('casa/agenda'), get('casa/envio'), get('casa/plano?mask.fieldPaths=done'), get('casa/teste'), get('tokens?pageSize=50'),
  ]);

  let events = [];
  try { events = JSON.parse(str(ag?.fields?.json) || '[]'); } catch { events = []; }
  const tf = teste?.fields;
  if (tf && str(tf.ts)) events.push({ ts: +str(tf.ts), k: 'teste:' + str(tf.ts), t: str(tf.t) || 'Teste de aviso', b: str(tf.b) || '', w: null });

  const done = {};
  const df = plano?.fields?.done?.mapValue?.fields || {};
  for (const k in df) if (df[k].booleanValue) done[k] = true;

  const tokens = (tl?.documents || []).map(d => ({
    id: d.name.split('/').pop(), token: str(d.fields?.token), who: str(d.fields?.who) || '', pref: str(d.fields?.pref) || 'todos',
  })).filter(t => t.token);

  const last = +(str(envio?.fields?.last) || 0);
  const { due, sends } = plan({ events, tokens, done, last, now });

  // Marca o horário antes de enviar: evita aviso duplicado se a execução cair no meio.
  await fetchFn(`${base}/casa/envio?updateMask.fieldPaths=last`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ fields: { last: { integerValue: String(now) } } }),
  });

  let ok = 0; const removed = new Set();
  for (const s of sends) {
    if (removed.has(s.id)) continue;
    const webpush = { notification: { icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: s.e.k, renotify: true } };
    if (env.APP_URL) {
      webpush.fcm_options = { link: env.APP_URL };
      webpush.notification.icon = new URL('icons/icon-192.png', env.APP_URL).href;
      webpush.notification.badge = new URL('icons/badge-96.png', env.APP_URL).href;
    }
    const r = await fetchFn(`https://fcm.googleapis.com/v1/projects/${project}/messages:send`, {
      method: 'POST', headers: H,
      body: JSON.stringify({ message: { token: s.token, notification: { title: s.e.t, body: s.e.b }, data: { k: s.e.k }, webpush } }),
    });
    if (r.ok) { ok++; continue; }
    const txt = await r.text();
    // Token que não existe mais (app desinstalado, permissão revogada): apaga.
    if (r.status === 404 || /UNREGISTERED|registration-token-not-registered|INVALID_ARGUMENT/.test(txt)) {
      removed.add(s.id);
      await fetchFn(`${base}/tokens/${encodeURIComponent(s.id)}`, { method: 'DELETE', headers: H });
    }
  }
  return { now: new Date(now).toISOString(), events: events.length, due: due.length, devices: tokens.length, sent: ok, removedTokens: removed.size };
}
