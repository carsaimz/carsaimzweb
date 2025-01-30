// ======================== Configuração do Firebase ========================
// Configuração necessária para inicializar o Firebase com as credenciais do projeto
const firebaseConfig = {
  apiKey: "AIzaSyAP7ouz6fSIkaWQWy6Von6DSG8_tm1N8yg",
  authDomain: "carsaimz.firebaseapp.com",
  databaseURL: "https://carsaimz-default-rtdb.firebaseio.com",
  projectId: "carsaimz",
  storageBucket: "carsaimz.firebasestorage.app",
  messagingSenderId: "728228416470",
  appId: "1:728228416470:web:76d8eac2db33cca0827277",
  measurementId: "G-24WVQYDEJ6"
};

// Inicializa o Firebase com as configurações fornecidas
firebase.initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase necessários
const auth = firebase.auth();  // Para autenticação
const analytics = firebase.analytics();  // Para Analytics (eventos automáticos)
const firestore = firebase.firestore();  // Para o Firestore
const database = firebase.database();  // Para Realtime Database
const storage = firebase.storage();  // Para o Firebase Storage
const messaging = firebase.messaging();  // Para Firebase Cloud Messaging

// ======================== Firebase Analytics - Monitoramento Automático ========================
// O Firebase Analytics coleta dados de eventos automaticamente sobre as interações do usuário no app.
// Isso inclui eventos padrão como abertura do app, atividades de usuários, e outros.
// Aqui, vamos logar eventos personalizados manualmente para alguns eventos específicos.

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Usuário autenticado:", user.displayName);
    // Evento de login registrado no Analytics
    analytics.logEvent('login', {
      method: user.providerData[0].providerId  // Método de login, como 'email', 'google', etc.
    });
  } else {
    console.log("Usuário não autenticado");
    // Evento de logout registrado no Analytics
    analytics.logEvent('logout');
  }
});

// ======================== Firebase Authentication - Autenticação ========================
// O Firebase Authentication registra eventos como login e logout automaticamente.
// Exemplo de como um evento de login é capturado automaticamente:
// Não é necessário adicionar código extra para monitorar esses eventos.

// ======================== Firestore e Realtime Database - Monitoramento Automático ========================
// O Firestore e o Realtime Database já capturam e enviam dados de leitura e gravação automaticamente.
// Exemplo de monitoramento automático em Firestore:

firestore.collection("users").doc("user_id").get().then(doc => {
  if (doc.exists) {
    console.log("Dados do usuário:", doc.data());
    // Evento de leitura no Firestore registrado automaticamente pelo Firebase Analytics
    analytics.logEvent('firestore_read', {
      document: 'users/user_id'
    });
  } else {
    console.log("Documento não encontrado");
    // Evento de erro ao tentar ler o Firestore
    analytics.logEvent('firestore_read_error', {
      document: 'users/user_id'
    });
  }
});

// Similar ao Firestore, no Realtime Database, qualquer leitura ou gravação de dados será registrada:
database.ref("users/user_id").on("value", snapshot => {
  console.log("Dados do usuário:", snapshot.val());
  // Evento de leitura no Realtime Database registrado automaticamente
  analytics.logEvent('realtime_db_read', {
    path: 'users/user_id'
  });
});

// ======================== Firebase Storage - Monitoramento Automático ========================
// O Firebase Storage também registra eventos automaticamente para uploads e downloads de arquivos.
// Exemplo de upload de arquivo, onde o evento é capturado automaticamente:

const storageRef = storage.ref('user_uploads/photo.jpg');

// Fazendo upload de um arquivo
const file = new Blob(["conteúdo de exemplo"], { type: "image/jpeg" }); // Substitua pelo seu arquivo
storageRef.put(file).then(() => {
  console.log('Arquivo enviado com sucesso!');
  // Firebase Analytics registra automaticamente o evento de upload
  analytics.logEvent('file_upload', {
    file_name: 'photo.jpg'
  });
});

// ======================== Firebase Cloud Messaging (FCM) - Monitoramento Automático ========================
// O Firebase Cloud Messaging registra eventos automaticamente, como o recebimento de notificações.
// Aqui está um exemplo de como o FCM pode ser usado para registrar eventos quando uma notificação push é recebida:

messaging.onMessage((payload) => {
  console.log("Mensagem recebida: ", payload);
  // Evento de notificação recebida é registrado automaticamente pelo Firebase Analytics
  analytics.logEvent('push_notification_received', {
    notification: payload.notification.title
  });
});

// ======================== Outros Eventos e Monitoramento Personalizado ========================
// Você pode adicionar mais eventos personalizados de monitoramento para ações específicas, como botões pressionados ou outras interações.
// Exemplo de evento personalizado para um botão pressionado:

document.getElementById('some-button').addEventListener('click', () => {
  // Evento personalizado registrado
  analytics.logEvent('button_click', {
    button_name: 'some-button'
  });
});