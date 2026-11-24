// Configuração do app. Preencha com os dados do SEU projeto Firebase (veja o README).
// Estes valores não são secretos: a proteção dos dados fica em firestore.rules.
self.APP_CONFIG = {
  firebase: {
    apiKey: "COLE_AQUI_A_API_KEY",
    authDomain: "SEU-PROJETO.firebaseapp.com",
    projectId: "SEU-PROJETO",
    storageBucket: "SEU-PROJETO.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000"
  },
  // Firebase Console › Configurações do projeto › Cloud Messaging › Certificados push da Web
  vapidKey: "COLE_AQUI_A_CHAVE_VAPID"
};
