// ============================================
// FIREBASE CONFIGURATION - UTP Marketplace
// ============================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // << FALTABA ESTE IMPORT

// variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
};

// Validar configuración
const validateFirebaseConfig = () => {
  const required = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  for (const key of required) {
    if (!import.meta.env[key]) {
      console.error(`❌ Missing Firebase config: ${key}`);
      return false;
    }
  }
  return true;
};

// Inicializar Firebase solo si la configuración es válida
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  if (validateFirebaseConfig()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    auth.useDeviceLanguage();

    console.log(" Firebase inicializado correctamente");
    console.log(" Proyecto:", firebaseConfig.projectId);
  } else {
    console.warn("⚠ Firebase NO inicializado - configuración incompleta");
  }
} catch (error) {
  console.error(" Error inicializando Firebase:", error);
}

// Exportar servicios (o null si no se inicializó)
export { app, auth, db, storage };

// Helper para verificar si Firebase está inicializado
export const isFirebaseInitialized = () => {
  return !!app;
};

// Exportación por defecto
export default app;
