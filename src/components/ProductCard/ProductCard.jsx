import React, { useState } from 'react';
import { useCart } from '../../hook/useCart';
import styles from './ProductCard.module.scss';

const ProductCard = ({ product, animationDelay = 0 }) => { 
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  //HOOK useCart
  const { addToCart } = useCart();

  // Debug
  console.log(`🎨 Renderizando ProductCard: ${product.name}`, product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageError = (e) => {
    console.error(`❌ Error cargando imagen para ${product.name}:`, product.image);
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Imagen cargada: ${product.name}`);
    setImageLoaded(true);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';

  return (
    <div 
      className={`${styles.productCard} ${styles.fadeIn}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className={styles.cardImage}>
        <img
          src={imageError ? defaultImage : product.image}
          alt={product.name}
          className={`${styles.productImage} ${imageLoaded ? styles.loaded : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {!imageLoaded && !imageError && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <small>Cargando...</small>
          </div>
        )}
        <div className={styles.categoryBadge}>
          {product.category}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        
        <div className={styles.productMeta}>
          <span className={styles.seller}><i className="bi bi-person"></i> {product.seller}</span>
          <span className={styles.condition}>{product.condition}</span>
          {product.rating && (
            <span className={styles.rating}><i className="bi bi-star-fill"></i> {product.rating}</span>
          )}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.price}>${product.price}</div>
          <button 
            className={`btn btn-primary ${styles.addToCartBtn}`}
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? 'Agregado ✓' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;