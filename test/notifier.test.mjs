// node --test test/  — testa o notificador com as APIs do Google simuladas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { run, plan } from '../notifier/notifier.mjs';

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const SA = JSON.stringify({ project_id: 'p', client_email: 'x@p.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) });
const NOW = Date.UTC(2026, 11, 5, 15, 0, 0); // 12:00 em Brasília

test('plan: só vencidos, respeita "feito" e preferência "só os meus"', () => {
  const events = [
    { ts: NOW - 30e3, k: 'a', w: null }, { ts: NOW - 40e3, k: 'b', w: 1 },
    { ts: NOW - 50e3, k: 'c', w: null }, { ts: NOW + 60e3, k: 'futuro', w: null },
    { ts: NOW - 3600e3, k: 'velho', w: null }, { ts: NOW - 20e3, k: 'esq', skip: 'c', w: null },
  ];
  const tokens = [{ id: 'r', token: 'R', who: '0', pref: 'meus' }, { id: 'l', token: 'L', who: '1', pref: 'todos' }];
  const { due, sends } = plan({ events, tokens, done: { c: true }, last: NOW - 120e3, now: NOW });
  assert.deepEqual(due.map(e => e.k).sort(), ['a', 'b']);
  assert.deepEqual(sends.map(s => s.token + s.e.k).sort(), ['La', 'Lb', 'Ra']);
});

test('run: lê agenda/tokens, envia FCM, apaga token inválido', async () => {
  const calls = [];
  const fs = 'https://firestore.googleapis.com/v1/projects/p/databases/(default)/documents';
  const agenda = [{ ts: NOW - 10e3, k: '2026-12-05:almoco', t: 'Almoço · 12:00', b: 'Frango', w: null }];
  const fetch = async (url, o = {}) => {
    calls.push([o.method || 'GET', url, o.body]);
    const J = (x, s = 200) => new Response(JSON.stringify(x), { status: s });
    if (url.startsWith('https://oauth2')) return J({ access_token: 'T' });
    if (url === `${fs}/casa/agenda`) return J({ fields: { json: { stringValue: JSON.stringify(agenda) } } });
    if (url === `${fs}/casa/envio`) return J({ fields: { last: { integerValue: String(NOW - 60e3) } } });
    if (url.startsWith(`${fs}/casa/plano`)) return J({ fields: { done: { mapValue: { fields: {} } } } });
    if (url === `${fs}/casa/teste`) return J({}, 404);
    if (url.startsWith(`${fs}/tokens?`)) return J({ documents: [
      { name: 'x/tokens/ok', fields: { token: { stringValue: 'OK' }, who: { stringValue: '0' }, pref: { stringValue: 'todos' } } },
      { name: 'x/tokens/morto', fields: { token: { stringValue: 'MORTO' }, who: { stringValue: '1' } } }] });
    if (url.includes('messages:send')) return JSON.parse(o.body).message.token === 'OK' ? J({ name: 'm' }) : J({ error: { status: 'NOT_FOUND', details: 'UNREGISTERED' } }, 404);
    return J({});
  };
  const r = await run({ FIREBASE_SERVICE_ACCOUNT: SA, APP_URL: 'https://app.exemplo/' }, { fetch, now: NOW });
  assert.equal(r.sent, 1); assert.equal(r.removedTokens, 1); assert.equal(r.due, 1);
  assert.ok(calls.some(([m, u]) => m === 'DELETE' && u.endsWith('/tokens/morto')));
  assert.ok(calls.some(([m, u, b]) => m === 'PATCH' && u.includes('casa/envio') && b.includes(String(NOW))));
  const msg = JSON.parse(calls.find(c => c[1].includes('messages:send'))[2]).message;
  assert.equal(msg.notification.title, 'Almoço · 12:00');
  assert.equal(msg.webpush.fcm_options.link, 'https://app.exemplo/');
});
