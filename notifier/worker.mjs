// Cloudflare Worker: roda o notificador a cada minuto (Cron Trigger).
import { run } from './notifier.mjs';

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(run(env).then(r => console.log(JSON.stringify(r)), e => console.error(e.message)));
  },
  // GET /run com o cabeçalho x-run-key: <RUN_KEY> roda na hora (útil para testar).
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname === '/run' && env.RUN_KEY && req.headers.get('x-run-key') === env.RUN_KEY) {
      try { return Response.json(await run(env)); } catch (e) { return Response.json({ error: e.message }, { status: 500 }); }
    }
    return new Response('Notificador da Dieta de Dezembro: ok');
  },
};
