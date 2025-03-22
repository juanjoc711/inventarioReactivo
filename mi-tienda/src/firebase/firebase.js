import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2T84mp_CNXOliSTsxbYS9_kqWUsw2GHY",
  authDomain: "bbdd-progra-web-pract1.firebaseapp.com",
  projectId: "bbdd-progra-web-pract1",
  storageBucket: "bbdd-progra-web-pract1.appspot.com",
  messagingSenderId: "930703522531",
  appId: "1:930703522531:web:62fcdff604fb745cf523d6",
  measurementId: "G-RHHHSYFQPW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//   Verificar si Firebase se inicializó correctamente
console.log("  Firebase inicializado:", app.name);

export { db };
