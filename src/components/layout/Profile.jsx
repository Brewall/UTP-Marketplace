// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      setUserData(snap.data());
    });

    return () => unsubscribe();
  }, [uid]);

  async function updateRole(newRole) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { role: newRole });
  }

  if (!userData) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Perfil</h2>
      <p>Nombre: {userData.displayName}</p>
      <p>Correo: {userData.email}</p>

      <h4>Tu rol actual: {userData.role}</h4>

      <h4>Cambiar rol</h4>
      <label>
        <input
          type="radio"
          checked={userData.role === "buyer"}
          onChange={() => updateRole("buyer")}
        /> 
        Comprador
      </label>

      <label>
        <input
          type="radio"
          checked={userData.role === "seller"}
          onChange={() => updateRole("seller")}
        /> 
        Vendedor
      </label>

      <label>
        <input
          type="radio"
          checked={userData.role === "both"}
          onChange={() => updateRole("both")}
        /> 
        Ambos
      </label>
    </div>
  );
}
