import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/products.service';
import ProductCard from './components/ProductCard';
import styles from './CatalogPage.module.scss';
import { FaSearch, FaFilter, FaTrash, FaSortAmountDown, FaBoxOpen } from 'react-icons/fa';

export default function CatalogPage() {
  // Datos base
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Parámetros de URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros controlados (inicializados desde URL)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('max') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        if (!active) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setError('Error al cargar productos');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Límites de precios
  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map(p => p.price).filter(p => typeof p === 'number');
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Derivar lista de categorías desde productos
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  // Sincronizar filtros con URL
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (priceMin) params.min = priceMin;
    if (priceMax) params.max = priceMax;
    setSearchParams(params, { replace: true });
  }, [search, category, sort, priceMin, priceMax, setSearchParams]);

  // Filtrado y ordenamiento memoizado
  const filteredProducts = useMemo(() => {
    let list = [...products];

    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
      );
    }

    if (category) {
      list = list.filter(p => p.category === category);
    }

    const minVal = priceMin !== '' ? parseFloat(priceMin) : null;
    const maxVal = priceMax !== '' ? parseFloat(priceMax) : null;
    if (minVal !== null && !Number.isNaN(minVal)) list = list.filter(p => p.price >= minVal);
    if (maxVal !== null && !Number.isNaN(maxVal)) list = list.filter(p => p.price <= maxVal);

    switch (sort) {
      case 'price-asc': list.sort((a,b)=> a.price - b.price); break;
      case 'price-desc': list.sort((a,b)=> b.price - a.price); break;
      case 'name-asc': list.sort((a,b)=> (a.title || '').localeCompare(b.title || '')); break;
      default: break;
    }

    return list;
  }, [products, search, category, priceMin, priceMax, sort]);

  const totalFound = filteredProducts.length;

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('');
    setSort('');
    setPriceMin('');
    setPriceMax('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Renderizar producto (fallback simple)
  const renderProduct = (product) => {
    if (ProductCard) return <ProductCard key={product.id} product={product} />;
    return (
      <div key={product.id} className={styles.productItem}>
        <h3>{product.title}</h3>
        <div className={styles.category}>{product.category}</div>
        <div className={styles.price}>S/ {product.price.toFixed(2)}</div>
      </div>
    );
  };

  return (
    <div className={styles.catalogPage}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Catálogo de Productos</h1>
        <div className="breadcrumbs">
          <span className={styles.breadcrumbs}>Inicio &gt; Catálogo</span>
        </div>
      </header>

      {/* Barra de controles */}
      <div className={styles.controlsCard}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.icon} />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar productos"
            />
          </div>
          <div className={styles.buttons}>
            <button type="button" onClick={() => setShowFilters(s => !s)}>
              <FaFilter /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
            <button type="button" className="secondary" onClick={() => setSort('price-asc')}>
              <FaSortAmountDown /> Precio ↑
            </button>
            <button type="button" className="danger" onClick={clearFilters}>
              <FaTrash /> Limpiar
            </button>
          </div>
        </div>

        {showFilters && (
          <div className={styles.filtersRow}>
            {/* Categoría */}
            <div className={styles.filterGroup}>
              <label htmlFor="category">Categoría</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Todas</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className={styles.filterGroup}>
              <label htmlFor="sort">Ordenar</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Sin ordenar</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
                <option value="name-asc">Nombre (A-Z)</option>
              </select>
            </div>

            {/* Precio */}
            <div className={styles.filterGroup}>
              <label>Rango de Precio</label>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder={`Min ${priceBounds.min}`}
                  value={priceMin}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <input
                  type="number"
                  placeholder={`Max ${priceBounds.max}`}
                  value={priceMax}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meta resultados */}
      <div className={styles.resultsMeta}>
        <div>{loading ? 'Cargando productos...' : `${totalFound} producto(s) encontrados`}</div>
        {search || category || priceMin || priceMax || sort ? (
          <button
            type="button"
            onClick={clearFilters}
            style={{ background: 'transparent', border: 'none', color: '#741111', cursor: 'pointer' }}
          >
            Limpiar filtros activos
          </button>
        ) : null}
      </div>

      {/* Grid / Estados */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.emptyState}>
          <FaBoxOpen className={styles.icon} />
          <h2>{error}</h2>
          <p>Intenta recargar la página.</p>
        </div>
      ) : totalFound === 0 ? (
        <div className={styles.emptyState}>
          <FaSearch className={styles.icon} />
          <h2>No se encontraron productos</h2>
          <p>Ajusta tus filtros o limpia para ver todos los artículos.</p>
          <button type="button" onClick={clearFilters}>
            <FaTrash /> Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map(renderProduct)}
        </div>
      )}
    </div>
  );
}
