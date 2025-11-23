import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '@/services/products.service';
import { useCartContext } from '../cart/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import styles from './ProductDetailPage.module.scss';
import { FaUserCircle, FaEnvelope, FaInfoCircle, FaExclamationTriangle, FaEdit } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCartContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      
      if (!data) {
        setError('Producto no encontrado');
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error('Error al cargar producto:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (category) => {
    const categoryColors = {
      'Libros': 'primary',
      'Tecnología': 'info',
      'Electrónica': 'warning',
      'Material Escolar': 'success',
      'Accesorios': 'secondary',
      'Ciencia': 'danger'
    };
    return `badge bg-${categoryColors[category] || 'secondary'}`;
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} role="status"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <FaExclamationTriangle className={styles.icon} />
            <p>{error || 'Producto no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* Grid Principal */}
        <div className={styles.grid}>
          {/* Imagen */}
          <div className={styles.imageCard}>
            <img
              src={product.imageUrl || `https://via.placeholder.com/600x400/741111/ffffff?text=${encodeURIComponent(product.title)}`}
              alt={product.title}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/600x400/741111/ffffff?text=Sin+Imagen`;
              }}
            />
          </div>

          {/* Info Card */}
          <div className={styles.infoCard}>
            {/* Insignia de Categoría */}
            <span className={`${styles.badge} ${styles[getCategoryBadgeClass(product.category).split('bg-')[1]]}`}>
              {product.category}
            </span>

            {/* Título */}
            <h1 className={styles.title}>{product.title}</h1>

            {/* Precio y Acciones */}
            <div className={styles.price}>
              {formatCurrency(product.price)}
            </div>
            
            {/* Verificar si el usuario es el vendedor */}
            {user && (user.id === product.sellerId || user.email === product.sellerEmail) ? (
              <div className="alert alert-info py-2 mb-3" role="alert">
                <FaEdit className="me-2" />
                <strong>Este es tu producto.</strong> Puedes editarlo o eliminarlo desde tu panel.
              </div>
            ) : product.stock <= 0 ? (
              <div className="alert alert-warning py-2 mb-3" role="alert">
                <FaExclamationTriangle className="me-2" />
                <strong>Sin stock disponible</strong>
              </div>
            ) : (
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    addItem(product, 1);
                    navigate('/carrito');
                  }}
                >
                  Agregar al Carrito
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => addItem(product, 1)}
                >
                  Añadir y Seguir
                </button>
              </div>
            )}

            {/* Descripción */}
            <div className={styles.section}>
              <h5>Descripción</h5>
              <p>{product.description}</p>
            </div>

            {/* Vendedor */}
            <div className={styles.sellerBox}>
              <h6>
                <FaUserCircle />
                Información del Vendedor
              </h6>
              <p>
                <strong>Nombre:</strong> {product.sellerName}
              </p>
              <p>
                <FaEnvelope /> {product.sellerEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className={styles.infoBox}>
          <h5>
            <FaInfoCircle />
            Información Importante
          </h5>
          <ul>
            <li>Verifica el estado del producto antes de realizar la compra</li>
            <li>Acuerda un lugar seguro para la entrega (preferiblemente dentro del campus UTP)</li>
            <li>Solicita fotos adicionales si es necesario</li>
            <li>No realices pagos sin haber verificado el producto</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
