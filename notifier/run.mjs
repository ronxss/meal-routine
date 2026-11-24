// Roda o notificador uma vez pelo Node (18+). Uso:
//   FIREBASE_SERVICE_ACCOUNT="$(cat conta-de-servico.json)" APP_URL=https://... node notifier/run.mjs
import { run } from './notifier.mjs';
run(process.env).then(r => console.log(JSON.stringify(r)), e => { console.error(e.message); process.exit(1); });
