// ============================================
// LOGIN PAGE
// Formulario de autenticación
// ============================================

import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.scss';
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft, FaExclamationTriangle, FaLightbulb, FaShieldAlt, FaUsers, FaLaptop } from 'react-icons/fa';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!/^[a-zA-Z0-9._-]+@utp\.edu\.pe$/.test(formData.email)) {
      return 'Usa un correo institucional @utp.edu.pe';
    }
    if (!formData.password || formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.loginHero}>
      <div className={styles.containerFluid}>
        <div className={styles.splitRow}>
          {/* Marketing / Beneficios */}
          <div className={styles.marketing}>
            <h2 className={styles.marketingTitle}>Acceso seguro para la comunidad UTP</h2>
            <ul className={styles.marketingList}>
              <li><FaShieldAlt /> Seguridad institucional con cuentas verificadas.</li>
              <li><FaUsers /> Interacción directa entre estudiantes.</li>
              <li><FaLaptop /> Herramientas y recursos académicos reales.</li>
            </ul>
          </div>

          {/* Panel de Login */}
          <div className={styles.panelWrapper}>
            <div className={styles.panel}>
              <div className={styles.panelContent}>
                <h1 className={styles.title}>Inicia Sesión</h1>
                <p className={styles.subtitle}>Ingresa con tu correo institucional para continuar.</p>

                {error && (
                  <div className={styles.errorAlert} role="alert">
                    <FaExclamationTriangle /> <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Correo UTP</label>
                    <div className={styles.inputWrapper}>
                      <FaEnvelope className={styles.icon} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="u12345678@utp.edu.pe"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className={styles.helper}>Formato: u+código@utp.edu.pe</div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Contraseña</label>
                    <div className={styles.inputWrapper}>
                      <FaLock className={styles.icon} />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength={6}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Iniciando...' : (<><FaSignInAlt /> Ingresar</>)}
                  </button>
                </form>

                <Link to="/bienvenida" className={styles.backLink}>
                  <FaArrowLeft /> Volver al inicio
                </Link>

                <div className={styles.demoBox}>
                  <FaLightbulb />
                  <p>
                    <span className={styles.highlight}>Demo:</span> Ingresa cualquier correo válido UTP y contraseña (≥6 caracteres).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
