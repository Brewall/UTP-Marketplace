
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Catalog.module.scss';


const Catalog = ({ products, loading }) => { // ← QUITAR addToCart de los props
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  // Debug: Verificar productos recibidos
  useEffect(() => {
    console.log('🔍 DEBUG Catalog Component:');
    console.log('📦 products prop:', products);
    console.log('🔄 loading prop:', loading);
    console.log('🎯 Total de productos:', products.length);
    
    if (products.length > 0) {
      console.log('✅ Primer producto:', products[0]);
      console.log('🖼️ URL de imagen del primer producto:', products[0].image);
      console.log('📋 Categorías disponibles:', [...new Set(products.map(p => p.category))]);
    }
  }, [products, loading]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return ['all', ...uniqueCategories];
  }, [products]);

  // Obtener rango de precios
  const priceRangeInfo = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Actualizar priceRange cuando cambien los productos
  useEffect(() => {
    setPriceRange([priceRangeInfo.min, priceRangeInfo.max]);
  }, [priceRangeInfo]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    console.log('🔧 Aplicando filtros...');
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    console.log(`📊 Productos después de filtrar: ${filtered.length}`);

    // Ordenar productos
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Manejar búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange([priceRangeInfo.min, priceRangeInfo.max]);
    setSearchParams({});
    console.log('🗑️ Filtros limpiados');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Libros': 'bi-book-fill',
      'Tecnología': 'bi-laptop',
      'Electrónica': 'bi-cpu',
      'Material Escolar': 'bi-pencil-fill',
      'Accesorios': 'bi-bag-fill',
      'Ciencia': 'bi-clipboard-data'
    };
    return icons[category] || 'bi-box';
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className={styles.catalog}>
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.catalog}>
      <div className="container">
        {/* Header de la página */}
        <div className="row">
          <div className="col-12">
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Catálogo de Productos</h1>
              <p className={styles.pageSubtitle}>
                Explora todos los productos disponibles en la comunidad UTP
              </p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Inicio</Link>
                  </li>
                  <li className="breadcrumb-item active">Catálogo</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Controles de Filtros y Búsqueda */}
        <div className="row mb-4">
          <div className="col-12">
            <div className={styles.controlsCard}>
              {/* Barra de Búsqueda */}
              <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar productos, descripción o vendedor..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <i className="bi bi-search" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}}></i>
                  {searchTerm && (
                    <button
                      className={styles.clearSearch}
                      onClick={() => setSearchTerm('')}
                      title="Limpiar búsqueda"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <button
                  className={`btn btn-outline-primary ${styles.filterToggle}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </button>
              </div>

              {/* Filtros Desplegables */}
              {showFilters && (
                <div className={styles.filtersSection}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Categoría</label>
                      <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'Todas las categorías' : category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Ordenar por</label>
                      <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name">Nombre (A-Z)</option>
                        <option value="price-low">Precio (Menor a Mayor)</option>
                        <option value="price-high">Precio (Mayor a Menor)</option>
                        <option value="rating">Mejor Valorados</option>
                      </select>
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <div className={styles.priceRange}>
                        <input
                          type="range"
                          className="form-range"
                          min={priceRangeInfo.min}
                          max={priceRangeInfo.max}
                          step="10"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        />
                        <input
                          type="range"
                          className="form-range"
                          min={priceRangeInfo.min}
                          max={priceRangeInfo.max}
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        />
                      </div>
                      <div className={styles.rangeLabels}>
                        <small>Mín: ${priceRangeInfo.min}</small>
                        <small>Máx: ${priceRangeInfo.max}</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-12">
                      <div className={styles.filterActions}>
                        <button
                          className="btn btn-outline-danger"
                          onClick={clearFilters}
                        >
                          <i className="bi bi-trash"></i> Limpiar Todos los Filtros
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información de Resultados */}
        <div className="row mb-3">
          <div className="col-12">
            <div className={styles.resultsInfo}>
              <div className={styles.resultsCount}>
                <strong>{filteredAndSortedProducts.length}</strong> de <strong>{products.length}</strong> productos encontrados
              </div>
              
              {searchTerm && (
                <div className={styles.searchInfo}>
                  Búsqueda: "<strong>{searchTerm}</strong>"
                </div>
              )}
              
              {selectedCategory !== 'all' && (
                <div className={styles.categoryInfo}>
                  Categoría: <strong>{selectedCategory}</strong>
                </div>
              )}

              {(priceRange[0] > priceRangeInfo.min || priceRange[1] < priceRangeInfo.max) && (
                <div className={styles.priceInfo}>
                  Precio: <strong>${priceRange[0]} - ${priceRange[1]}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Productos */}
        {filteredAndSortedProducts.length > 0 ? (
          <>
            <div className="row">
              {filteredAndSortedProducts.map((product, index) => (
                <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                  <ProductCard 
                    product={product} 
                    animationDelay={index * 0.05} // ← QUITAR addToCart={addToCart}
                  />
                </div>
              ))}
            </div>
            
            {/* Información de paginación */}
            <div className="row mt-4">
              <div className="col-12 text-center">
                <div className={styles.loadMoreSection}>
                  <p className={styles.showingText}>
                    Mostrando <strong>{filteredAndSortedProducts.length}</strong> productos
                    {filteredAndSortedProducts.length < products.length && (
                      <span> de <strong>{products.length}</strong> disponibles</span>
                    )}
                  </p>
                  {filteredAndSortedProducts.length < products.length && (
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-file-earmark-text"></i> Cargar Más Productos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Estado Sin Resultados */
          <div className="row">
            <div className="col-12">
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}><i className="bi bi-search" style={{fontSize: '3rem'}}></i></div>
                <h3>No se encontraron productos</h3>
                <p>
                  {searchTerm || selectedCategory !== 'all' || priceRange[0] > priceRangeInfo.min || priceRange[1] < priceRangeInfo.max
                    ? 'Intenta ajustar tus filtros de búsqueda o limpiar los filtros actuales.'
                    : 'Actualmente no hay productos disponibles en el catálogo.'
                  }
                </p>
                <div className={styles.noResultsActions}>
                  {(searchTerm || selectedCategory !== 'all' || priceRange[0] > priceRangeInfo.min || priceRange[1] < priceRangeInfo.max) && (
                    <button
                      className="btn btn-primary"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-trash"></i> Limpiar Filtros
                    </button>
                  )}
                  <Link to="/" className="btn btn-outline-secondary">
                    <i className="bi bi-house"></i> Volver al Inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categorías Rápidas */}
        {!loading && products.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className={styles.quickCategories}>
                <h4>Explorar por Categoría</h4>
                <div className={styles.categoryTags}>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <Link
                      key={category}
                      to={`/catalog?category=${category}`}
                      className={`${styles.categoryTag} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                      }}
                    >
                      <i className={`bi ${getCategoryIcon(category)}`}></i> {category}
                      <span className={styles.productCount}>
                        ({products.filter(p => p.category === category).length})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="row mt-3">
            <div className="col-12">
              <div className={styles.debugInfo}>
                <small>
                  <strong>Debug Info:</strong> Productos: {products.length} | 
                  Filtrados: {filteredAndSortedProducts.length} | 
                  Cargando: {loading.toString()}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;