import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyB_KX3Av338I8PfdCeP_r0QOnTJvnW20aw",
  authDomain: "mufasapp-4f753.firebaseapp.com",
  projectId: "mufasapp-4f753",
  storageBucket: "mufasapp-4f753.firebasestorage.app",
  messagingSenderId: "783076295494",
  appId: "1:783076295494:web:15a21919d5b0eee5025b47",
  measurementId: "G-SWWG54KBDY"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos auth y firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);