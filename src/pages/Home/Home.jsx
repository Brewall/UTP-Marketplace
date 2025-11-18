import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Home.module.scss';

const Home = ({ products, loading }) => { // ← QUITAR addToCart de los props
  const categories = [
    {
      name: 'Libros Académicos',
      description: 'Encuentra los libros que necesitas para tus cursos',
      icon: 'bi-book-fill',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      link: '/catalog?category=Libros'
    },
    {
      name: 'Tecnología',
      description: 'Laptops, tablets y accesorios tecnológicos',
      icon: 'bi-laptop',
      image: 'https://media.licdn.com/dms/image/v2/D4E12AQHHUlAHJzEsRw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1723591466541?e=2147483647&v=beta&t=0pVlRf0AAtQ3TLI-3oA0RNIPAFQU4ycmJCGTg8YLhW4',
      link: '/catalog?category=Tecnología'
    },
    {
      name: 'Electrónica',
      description: 'Componentes y kits para tus proyectos',
      icon: 'bi-cpu',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJiEMJNd0FeRSlH-gRKGNiBKvUUznMeOXPHg&s',
      link: '/catalog?category=Electrónica'
    }
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Bienvenido a <span>UTP Marketplace</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  La plataforma perfecta para la comunidad universitaria. 
                  Compra, vende o intercambia libros, materiales y servicios entre estudiantes.
                </p>
                <div className={styles.heroButtons}>
                  <Link to="/catalog" className="btn btn-primary btn-lg">
                    Explorar Catálogo
                  </Link>
                  <Link to="/catalog?category=Libros" className="btn btn-outline-light btn-lg">
                    Ver Libros
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.heroVisual}>
                <img 
                  src="https://www.utp.edu.pe/descubre-utp/sites/consideracion/files/imagenes/Sala%20de%20cubiculos%201.jpg" 
                  alt="Estudiantes universitarios"
                  className={styles.heroImage}
                />
                <div className={styles.floatingElements}>
                  <div className={styles.floatingElement}>
                    <i className="bi bi-book-fill"></i>
                    <small>Libros</small>
                  </div>
                  <div className={styles.floatingElement}>
                    <i className="bi bi-laptop"></i>
                    <small>Tecnología</small>
                  </div>
                  <div className={styles.floatingElement}>
                    <i className="bi bi-wrench"></i>
                    <small>Materiales</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className={styles.categories}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Categorías Destacadas</h2>
              <p className={styles.sectionSubtitle}>
                Explora nuestros productos por categoría
              </p>
            </div>
          </div>
          <div className="row">
            {categories.map((category, index) => (
              <div key={category.name} className="col-md-4 mb-4">
                <Link to={category.link} className={styles.categoryCard}>
                  <div className={styles.categoryImage}>
                    <img src={category.image} alt={category.name} />
                    <div className={styles.categoryOverlay}>
                      <i className={`bi ${category.icon} ${styles.categoryIcon}`}></i>
                    </div>
                  </div>
                  <div className={styles.categoryContent}>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className={styles.categoryLink}>Explorar <i className="bi bi-arrow-right"></i></span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className={styles.featured}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Productos Destacados</h2>
              <p className={styles.sectionSubtitle}>
                Los productos más populares entre la comunidad UTP
              </p>
            </div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {products.map((product, index) => (
                <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                  <ProductCard 
                    product={product} 
                    // ← QUITAR addToCart={addToCart}
                    animationDelay={index * 0.1}
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="row mt-4">
            <div className="col-12 text-center">
              <Link to="/catalog" className="btn btn-outline-primary btn-lg">
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className={styles.whyUs}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img 
                src="https://www.utp.edu.pe/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg" 
                alt="Comunidad universitaria"
                className={styles.whyUsImage}
              />
            </div>
            <div className="col-lg-6">
              <div className={styles.whyUsContent}>
                <h2>¿Por qué elegir UTP Marketplace?</h2>
                <div className={styles.benefits}>
                  <div className={styles.benefit}>
                    <i className={`bi bi-cash-coin ${styles.benefitIcon}`}></i>
                    <div>
                      <h4>Precios Estudiantiles</h4>
                      <p>Productos a precios accesibles para estudiantes</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <i className={`bi bi-people-fill ${styles.benefitIcon}`}></i>
                    <div>
                      <h4>Comunidad Confiable</h4>
                      <p>Compra y vende entre miembros de la comunidad UTP</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <i className={`bi bi-rocket-takeoff-fill ${styles.benefitIcon}`}></i>
                    <div>
                      <h4>Entrega Rápida</h4>
                      <p>Recoge tus productos en el campus universitario</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <i className={`bi bi-shield-lock-fill ${styles.benefitIcon}`}></i>
                    <div>
                      <h4>Transacciones Seguras</h4>
                      <p>Sistema seguro para todas tus compras y ventas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;