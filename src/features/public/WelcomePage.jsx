// ============================================
// WELCOME PAGE - HERO SECTION (Public Feature)
// Landing page para usuarios no autenticados
// ============================================

import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './WelcomePage.module.scss';
import { FaBook, FaLaptop, FaTools, FaShieldAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

export default function WelcomePage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="row align-items-center">
            {/* Texto Izquierda */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className={styles.heroTitle}>
                Bienvenido a <span>UTP+Marketplace</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Compra y vende de forma segura entre estudiantes UTP. Libros, tecnología y más
                en un solo lugar hecho para la comunidad.
              </p>
              <div className={styles.ctaGroup}>
                <Link to="/ingresar" className={styles.primaryBtn}>Ingresar con Correo UTP</Link>
                <a href="#beneficios" className={styles.secondaryBtn}>Saber más</a>
              </div>
              <div className={styles.heroFeatures}>
                <div>
                  <FaShieldAlt /> <span>Seguridad</span>
                </div>
                <div>
                  <FaUsers /> <span>Comunidad</span>
                </div>
                <div>
                  <FaLaptop /> <span>Tecnología</span>
                </div>
              </div>
            </div>
            {/* Imagen + Íconos flotantes */}
            <div className="col-lg-6">
              <div className={styles.visualWrapper}>
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&auto=format&fit=crop&q=60"
                  alt="Estudiantes colaborando"
                  className={styles.heroImage}
                />
                <div className={`${styles.floatIcon} ${styles.float1}`}><FaBook /></div>
                <div className={`${styles.floatIcon} ${styles.float2}`}><FaLaptop /></div>
                <div className={`${styles.floatIcon} ${styles.float3}`}><FaTools /></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroOverlay} />
      </section>

      {/* Categorías */}
      <section className={styles.categories}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Explora Categorías</h2>
          <div className="row g-4 mt-1">
            {CATEGORY_DATA.map(cat => (
              <div className="col-md-4" key={cat.key}>
                <div className={styles.categoryCard}>
                  <div className={styles.categoryBg} style={{ backgroundImage: `url(${cat.image})` }} />
                  <div className={styles.categoryOverlay}>
                    {cat.icon}
                  </div>
                  <div className={styles.categoryContent}>
                    <h3>{cat.title}</h3>
                    <p>{cat.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className={styles.benefits}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className={styles.benefitsImageWrapper}>
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=60"
                  alt="Campus UTP"
                  className={styles.benefitsImage}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
              <ul className={styles.benefitsList}>
                <li><FaShieldAlt /> <span>Precios justos entre estudiantes, sin intermediarios.</span></li>
                <li><FaUsers /> <span>Comunidad verificada con correos institucionales.</span></li>
                <li><FaMapMarkerAlt /> <span>Entrega presencial segura dentro del campus.</span></li>
                <li><FaLaptop /> <span>Enfoque académico: recursos y herramientas reales.</span></li>
              </ul>
              <div className={styles.bottomCta}>¿Listo para empezar? <Link to="/ingresar">Ingresa ahora</Link></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Datos de las categorías
const CATEGORY_DATA = [
  {
    key: 'libros',
    title: 'Libros Académicos',
    text: 'Material de estudio, guías y referencias clave.',
    icon: <FaBook />,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=60'
  },
  {
    key: 'tecnologia',
    title: 'Tecnología',
    text: 'Laptops, accesorios y dispositivos para clases.',
    icon: <FaLaptop />,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'
  },
  {
    key: 'electronica',
    title: 'Electrónica',
    text: 'Calculadoras, periféricos y herramientas técnicas.',
    icon: <FaTools />,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60'
  }
];
