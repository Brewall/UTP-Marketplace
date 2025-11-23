import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/products.service';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import styles from './ProductFormPage.module.scss';
import { FaPlusCircle, FaCheckCircle, FaTimes, FaExclamationTriangle, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';

const CATEGORIES = [
  { value: 'Libros', label: 'Libros' },
  { value: 'Tecnología', label: 'Tecnología' },
  { value: 'Electrónica', label: 'Electrónica' },
  { value: 'Material Escolar', label: 'Material Escolar' },
  { value: 'Accesorios', label: 'Accesorios' },
  { value: 'Ciencia', label: 'Ciencia' }
];

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myProducts, setMyProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Libros',
    description: '',
    imageUrl: '',
    stock: '1'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar productos del vendedor al montar el componente
  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    if (!user?.id && !user?.email) return;
    try {
      setLoadingProducts(true);
      const products = await productService.getBySeller(user.id || user.email);
      setMyProducts(products);
    } catch (e) {
      console.error('Error al cargar publicaciones:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Ingresa una URL válida';
    }

    if (!formData.stock || parseInt(formData.stock) < 1) {
      newErrors.stock = 'Debes tener al menos 1 unidad disponible';
    }

    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || null,
        stock: parseInt(formData.stock),
        sellerId: user.id,
        sellerName: user.name,
        sellerEmail: user.email
      };

      if (selectedProduct) {
        // Actualizar producto existente
        await productService.update(selectedProduct.id, productData);
        setErrors({ submit: '✅ Producto actualizado exitosamente' });
      } else {
        // Crear nuevo producto
        await productService.create(productData);
        setErrors({ submit: '✅ Producto publicado exitosamente' });
      }

      // Recargar lista y limpiar formulario
      await loadMyProducts();
      handleNewProduct();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setErrors({}), 3000);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrors({ submit: 'Hubo un error al guardar el producto. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title || '',
      price: product.price?.toString() || '',
      category: product.category || 'Libros',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock?.toString() || '1'
    });
    setErrors({});
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setFormData({
      title: '',
      price: '',
      category: 'Libros',
      description: '',
      imageUrl: '',
      stock: '1'
    });
    setErrors({});
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;
    
    try {
      await productService.delete(productId);
      await loadMyProducts();
      if (selectedProduct?.id === productId) {
        handleNewProduct();
      }
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
    }
  };

  return (
    <div className={styles.formPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>
            <FaPlusCircle />
            Gestionar Publicaciones
          </h1>
          <p className={styles.subtitle}>Crea nuevos productos o edita tus publicaciones existentes</p>
        </header>

        <div className={styles.layout}>
          {/* SIDEBAR: Lista de publicaciones */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Mis Publicaciones ({myProducts.length})</h3>
              <button 
                type="button" 
                className={styles.btnNew}
                onClick={handleNewProduct}
                title="Nuevo producto"
              >
                <FaPlusCircle /> Nuevo
              </button>
            </div>

            {loadingProducts ? (
              <div className={styles.loading}>Cargando...</div>
            ) : myProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <FaBoxOpen />
                <p>No tienes publicaciones aún</p>
              </div>
            ) : (
              <ul className={styles.productList}>
                {myProducts.map(product => (
                  <li 
                    key={product.id}
                    className={`${styles.productItem} ${selectedProduct?.id === product.id ? styles.active : ''}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <img src={product.imageUrl || 'https://via.placeholder.com/60'} alt={product.title} />
                    <div className={styles.productInfo}>
                      <h4>{product.title}</h4>
                      <span className={styles.price}>{formatCurrency(product.price)}</span>
                      <span className={styles.stock}>Stock: {product.stock || 0}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.btnDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* FORMULARIO */}
          <div className={styles.formCard}>
            {errors.submit && (
              <div className={errors.submit.startsWith('✅') ? styles.successAlert : styles.errorAlert} role="alert">
                {!errors.submit.startsWith('✅') && <FaExclamationTriangle />}
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Título */}
              <div className={styles.formGroup}>
                <label htmlFor="title">
                  Título del producto *
                </label>
                <input
                  type="text"
                  className={errors.title ? styles.error : ''}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Laptop HP Pavilion Gaming"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title}</span>
                )}
              </div>

              {/* Precio, Categoría y Stock */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={errors.price ? styles.error : ''}
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <span className={styles.errorText}>{errors.price}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stock">
                    Existencias *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={errors.stock ? styles.error : ''}
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="1"
                    disabled={isSubmitting}
                  />
                  {errors.stock && (
                    <span className={styles.errorText}>{errors.stock}</span>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className={styles.formGroup}>
                <label htmlFor="description">
                  Descripción *
                </label>
                <textarea
                  className={errors.description ? styles.error : ''}
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe tu producto en detalle (estado, características, etc.)"
                  disabled={isSubmitting}
                ></textarea>
                {errors.description && (
                  <span className={styles.errorText}>{errors.description}</span>
                )}
                <span className={styles.helperText}>
                  {formData.description.length} caracteres (mínimo 20)
                </span>
              </div>

              {/* URL de Imagen */}
              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="url"
                  className={errors.imageUrl ? styles.error : ''}
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isSubmitting}
                />
                {errors.imageUrl && (
                  <span className={styles.errorText}>{errors.imageUrl}</span>
                )}
                <span className={styles.helperText}>
                  Si no proporcionas una imagen, se usará una imagen por defecto
                </span>
              </div>

              {/* Botones */}
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Guardando...'
                  ) : selectedProduct ? (
                    <>
                      <FaEdit />
                      Actualizar Producto
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Publicar Producto
                    </>
                  )}
                </button>
                {selectedProduct && (
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={handleNewProduct}
                    disabled={isSubmitting}
                  >
                    <FaTimes /> Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;
