# Dieta de Dezembro — app da casa

App (PWA) feito a partir do artefato **Dieta de Dezembro**: plano de refeições, marmitas, receitas, compras e treinos de dezembro/2026 para **duas pessoas**.

- **Os dois ajustam e veem tudo**: cada um entra com a própria conta. Marcações, gastos, horários, pesos, treinos e preços ficam num só lugar (Firebase Firestore) e aparecem nos dois celulares na hora.
- **Notificações nos horários**: café, almoço, lanche/pré-treino, jantar, ceia, treinos, compras, preparo das marmitas, descongelar e água. Também avisa 15 min antes para esquentar a marmita. Chegam **com o app fechado**, nos dois celulares.
  - Cada celular escolhe receber avisos **dos dois** (padrão) ou **só os meus**. Refeições e tarefas da casa chegam sempre para os dois.
  - Item marcado como feito antes da hora não avisa.
  - Mudou um horário em Ajustes? A agenda de avisos é recalculada e salva sozinha.
- **Funciona offline** e instala como app (Android e iPhone).
- Sem Firebase configurado, o app funciona só no aparelho (bom para testar).

## Como funciona

```
 Celular A ─┐                        ┌─> Firestore: casa/plano   (dados dos dois)
            ├─ app (public/) ────────┼─> Firestore: casa/agenda  (avisos calculados pelo app)
 Celular B ─┘                        └─> Firestore: tokens/*     (celulares com aviso ligado)

 Notificador (a cada minuto) ── lê agenda + tokens ── envia via Firebase Cloud Messaging ──> A e B
```

| Pasta/arquivo | O que é |
|---|---|
| `public/` | O app: `index.html`, `app.js` (motor do plano, vindo do artefato), `sw.js` (offline + push), `config.js` (seu Firebase) |
| `notifier/` | Notificador sem dependências: `worker.mjs` (Cloudflare Workers) e `run.mjs` (Node) |
| `firestore.rules` | Só os e-mails de vocês dois leem e escrevem |
| `wrangler.toml` | Configuração do Worker que roda a cada minuto |

## Colocar no ar (uma vez, ~20 min)

### 1. Firebase (grátis, plano Spark)
1. Em <https://console.firebase.google.com> crie um projeto.
2. **Authentication › Sign-in method**: ative **E-mail/senha**. Em **Users**, crie as duas contas (uma para cada pessoa). Em **Settings › User actions**, desmarque *Enable create (sign-up)* para ninguém mais se cadastrar.
3. **Firestore Database**: crie o banco (modo produção, região `southamerica-east1`).
4. **Configurações do projeto › Geral › Seus apps**: adicione um app **Web** e copie o `firebaseConfig` para `public/config.js`.
5. **Configurações do projeto › Cloud Messaging › Certificados push da Web**: gere o par de chaves e cole em `vapidKey` no `public/config.js`.
6. Em `firestore.rules`, troque `pessoa1@exemplo.com` e `pessoa2@exemplo.com` pelos e-mails das duas contas.

### 2. Publicar o app e as regras
```bash
npm i -g firebase-tools
firebase login
cp .firebaserc.example .firebaserc   # troque SEU-PROJETO pelo ID do projeto
firebase deploy --only hosting,firestore:rules
```
O app fica em `https://SEU-PROJETO.web.app`. (Também dá para usar GitHub Pages servindo a pasta `public/`; publique as regras com `firebase deploy --only firestore:rules`.)

### 3. Notificador (Cloudflare Workers, grátis, roda a cada minuto)
1. Firebase › **Configurações do projeto › Contas de serviço › Gerar nova chave privada**. Guarde o JSON **fora do repositório**.
2. Crie uma conta grátis em <https://dash.cloudflare.com> e rode:
   ```bash
   npm i -g wrangler
   wrangler login
   # edite APP_URL em wrangler.toml com o endereço do app
   wrangler secret put FIREBASE_SERVICE_ACCOUNT < conta-de-servico.json
   wrangler secret put RUN_KEY        # uma senha qualquer, para testar pelo navegador/curl
   wrangler deploy
   ```
3. Teste: `curl -H "x-run-key: SUA_SENHA" https://dieta-notificador.SEU-USUARIO.workers.dev/run`

Sem Cloudflare? Dá para rodar `node notifier/run.mjs` em qualquer máquina com cron a cada minuto (veja o comentário no arquivo). O workflow `.github/workflows/notificar.yml` roda o notificador manualmente para testar a conta de serviço — não use o agendamento do GitHub para isso: atrasa e gasta minutos em repositório privado.

### 4. Em cada celular
1. Abra o endereço do app e entre com o e-mail e a senha da pessoa.
2. Instale: **Android/Chrome** menu ⋮ › *Instalar app*. **iPhone/Safari** Compartilhar › *Adicionar à Tela de Início* (iOS 16.4+; no iPhone as notificações só funcionam abrindo pelo ícone).
3. Em **Ajustes**: escolha *Este celular é de…*, toque em **Ativar notificações** e depois em **Enviar teste**. Os dois celulares devem receber em até 1 minuto.

## Desenvolvimento
```bash
npm start      # serve public/ em http://localhost:5173 (sem Firebase: modo local)
npm test       # testes do notificador
```

Quantidades estimadas para adultos; não substitui um nutricionista.
