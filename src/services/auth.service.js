
// src/services/auth.service.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../firebase";

// =====================================================
// REGISTRO DE USUARIO
// =====================================================
async function registerUser(email, password, displayName, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName,
      role, // buyer | seller | both
      createdAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return { success: false, message: "Esta cuenta ya existe" };
    }
    return { success: false, message: error.message };
  }
}

// =====================================================
// LOGIN
// =====================================================
async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// =====================================================
// EXPORTACIONES
// =====================================================
export default {
  registerUser,
  loginUser
};

export { registerUser, loginUser };
