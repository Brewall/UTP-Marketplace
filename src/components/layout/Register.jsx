
import React, { useState } from "react";
import { registerUser } from "../services/AuthService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const result = await registerUser(email, password, displayName, role);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("Cuenta creada correctamente");
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Crear Cuenta</h2>

      <input 
        type="text" 
        placeholder="Nombre completo"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />

      <input 
        type="email" 
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input 
        type="password" 
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <h4>Selecciona tu rol</h4>
      <label>
        <input 
          type="radio" 
          value="buyer"
          checked={role === "buyer"}
          onChange={() => setRole("buyer")}
        /> Comprador
      </label>

      <label>
        <input 
          type="radio" 
          value="seller"
          checked={role === "seller"}
          onChange={() => setRole("seller")}
        /> Vendedor
      </label>

      <label>
        <input 
          type="radio"
          value="both"
          checked={role === "both"}
          onChange={() => setRole("both")}
        /> Ambos
      </label>

      <button type="submit">Crear Cuenta</button>

      {message && <p>{message}</p>}
    </form>
  );
}
