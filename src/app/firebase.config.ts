// Importações Firebase
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_i1YMMNBQvnNm33pkf3SS_tdiPSrkJ14",
  authDomain: "geekco-image-storage.firebaseapp.com",
  projectId: "geekco-image-storage",
  storageBucket: "geekco-image-storage.appspot.com",
  messagingSenderId: "25403373326",
  appId: "1:25403373326:web:69713d2ef65cdd5560c95f",
  measurementId: "G-EJRS07XV08"
};


// Inicializa Firebase App
const app = initializeApp(firebaseConfig);

// Exporta o storage para usar nos serviços
export const storage = getStorage(app);
