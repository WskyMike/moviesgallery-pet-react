// Функция для ленивой загрузки Firebase и инициализации
let app = null;
let auth = null;
let db = null;

const firebaseConfig = {
  apiKey: 'AIzaSyAEKgrY02bNte1T3j2DPxaaK8QkLWwysUc',
  authDomain: 'moviegallery-idd3d.firebaseapp.com',
  projectId: 'moviegallery-idd3d',
  storageBucket: 'moviegallery-idd3d.appspot.com',
  messagingSenderId: '544141712617',
  appId: '1:544141712617:web:67911f7d23a120fcd0e478',
  measurementId: 'G-CGCBH369LZ',
};

export async function initializeFirebase() {
  if (!app) {
    const firebase = await import('firebase/app');
    app = firebase.initializeApp(firebaseConfig);
  }
  return app;
}

export async function getAuthInstance() {
  if (!auth) {
    await initializeFirebase();
    const { getAuth } = await import('firebase/auth');
    auth = getAuth(app);
  }
  return auth;
}

export async function getFirestoreInstance() {
  if (!db) {
    await initializeFirebase();
    const { getFirestore } = await import('firebase/firestore');
    db = getFirestore(app);
  }
  return db;
}
