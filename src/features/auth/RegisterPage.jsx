import React, { useState } from "react";
import { registerUser } from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser(email, password, displayName, role);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate("/ingresar");
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.formContainer}>

        <h2>Crear Cuenta</h2>

        <form onSubmit={onSubmit}>

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

          <div className={styles.roleSection}>
            <h4>Selecciona tu rol</h4>

            <label>
              <input
                type="radio"
                checked={role === "buyer"}
                onChange={() => setRole("buyer")}
              />
              Comprador
            </label>

            <label>
              <input
                type="radio"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Vendedor
            </label>

            <label>
              <input
                type="radio"
                checked={role === "both"}
                onChange={() => setRole("both")}
              />
              Ambos
            </label>
          </div>

          <button type="submit">Crear cuenta</button>
        </form>

        {message && <p className={styles.errorMsg}>{message}</p>}

        <p className={styles.loginLink}>
          ¿Ya tienes una cuenta?
          <Link to="/ingresar">Ingresar aquí</Link>
        </p>

      </div>
    </div>
  );
}
