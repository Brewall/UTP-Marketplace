// ============================================
// AUTH SERVICE - Firebase
// ============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../firebase";

// ============================================
// REGISTRO DE USUARIO
// ============================================

export async function registerUser(email, password, displayName, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName,
      role,
      createdAt: serverTimestamp()
    });

    // Guardar sesión
    const userData = { uid, email, displayName, role };
    sessionStorage.setItem("utp_user", JSON.stringify(userData));

    return { success: true, user: userData };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ============================================
// LOGIN
// ============================================

export async function loginUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Cargar datos desde Firestore
    const uid = result.user.uid;
    const snap = await getDoc(doc(db, "users", uid));

    const userData = { uid, ...snap.data() };

    // Guardar sesión
    sessionStorage.setItem("utp_user", JSON.stringify(userData));

    return userData;

  } catch (error) {
    throw new Error(error.message);
  }
}

// ============================================
// LOGOUT
// ============================================

export async function logoutUser() {
  await signOut(auth);
  sessionStorage.removeItem("utp_user");
}

// ============================================
// OBTENER USUARIO ACTUAL
// ============================================

export function getCurrentUser() {
  const stored = sessionStorage.getItem("utp_user");
  return stored ? JSON.parse(stored) : null;
}
