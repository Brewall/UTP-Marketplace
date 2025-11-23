// ============================================
// COMPONENTE TARJETA DE PRODUCTO
// Tarjeta reutilizable para mostrar productos
// ============================================

import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductCard({ product }) {
  // Imagen por defecto si no hay URL
  const defaultImage = 'https://via.placeholder.com/300x200/741111/ffffff?text=Sin+Imagen';
  const imageUrl = product.imageUrl || defaultImage;

  // Mapeo de categorías a colores de insignia
  const categoryColors = {
    'Libros': 'primary',
    'Tecnología': 'info',
    'Electrónica': 'warning',
    'Material Escolar': 'success',
    'Accesorios': 'secondary',
    'Ciencia': 'danger'
  };

  const badgeColor = categoryColors[product.category] || 'secondary';

  return (
    <div className="card h-100 shadow-sm border-0 hover-card">
      {/* Imagen del Producto */}
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={imageUrl}
          className="card-img-top h-100 w-100"
          alt={product.title}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        {/* Insignia de Categoría */}
        <span 
          className={`badge bg-${badgeColor} position-absolute top-0 end-0 m-2`}
          style={{ fontSize: '0.75rem' }}
        >
          {product.category}
        </span>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="card-body d-flex flex-column">
        {/* Título del Producto */}
        <h5 className="card-title text-truncate mb-2" title={product.title}>
          {product.title}
        </h5>

        {/* Descripción Corta */}
        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        {/* Footer: Precio y Botón */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          {/* Precio */}
          <div>
            <span className="text-danger fw-bold fs-5">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Botón Ver Detalles */}
          <Link 
            to={`/producto/${product.id}`}
            className="btn btn-outline-danger btn-sm"
          >
            Ver Detalles
          </Link>
        </div>

        {/* Información del Vendedor */}
        {product.sellerName && (
          <div className="mt-2 pt-2 border-top">
            <small className="text-muted">
              <i className="bi bi-person me-1"></i>
              {product.sellerName}
            </small>
          </div>
        )}
      </div>

      {/* Estilos para el efecto hover */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem rgba(116, 17, 17, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
