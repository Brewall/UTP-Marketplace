// ============================================
// PRODUCTS SERVICE - UTP Marketplace
// Servicio de gestión de productos (CRUD con LocalStorage)
// ============================================

import { isValidPrice, isValidText, sanitizeHTML } from '../utils/validators';
import { generateId } from '../utils/formatters';

// Clave para localStorage
const PRODUCTS_STORAGE_KEY = 'utp_marketplace_products';

// Productos semilla (iniciales)
const SEED_PRODUCTS = [
  {
    id: 'seed-1',
    title: 'Cálculo Diferencial e Integral - Stewart',
    description: 'Libro de cálculo en excelente estado, incluye ejercicios resueltos. Perfecto para Ingeniería.',
    price: 45.00,
    category: 'Libros',
    condition: 'Como nuevo',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    sellerId: 'u20201234',
    sellerName: 'Juan Pérez',
    sellerEmail: 'u20201234@utp.edu.pe',
    createdAt: new Date('2024-11-15').toISOString(),
    status: 'available'
  },
  {
    id: 'seed-2',
    title: 'Laptop Dell Inspiron 15 - 8GB RAM',
    description: 'Laptop en buen estado, ideal para programación y estudio. Incluye cargador y mochila.',
    price: 1200.00,
    category: 'Tecnología',
    condition: 'Usado - Buen estado',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    sellerId: 'u20195678',
    sellerName: 'María García',
    sellerEmail: 'u20195678@utp.edu.pe',
    createdAt: new Date('2024-11-18').toISOString(),
    status: 'available'
  },
  {
    id: 'seed-3',
    title: 'Calculadora Científica TI-84 Plus',
    description: 'Calculadora gráfica en perfecto estado. Perfecta para cálculo y estadística.',
    price: 95.00,
    category: 'Material Escolar',
    condition: 'Seminuevo',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400',
    sellerId: 'u20189012',
    sellerName: 'Carlos López',
    sellerEmail: 'u20189012@utp.edu.pe',
    createdAt: new Date('2024-11-20').toISOString(),
    status: 'available'
  }
];

/**
 * Servicio de productos
 * Maneja todas las operaciones CRUD de productos usando LocalStorage
 */
const productsService = {
  /**
   * Obtiene todos los productos
   * Si el localStorage está vacío, inicializa con productos semilla
   * @returns {Promise<Array>} - Array de productos
   */
  getAll: async () => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let products = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY));

      // Si no hay productos, inicializar con semilla
      if (!products || products.length === 0) {
        console.log('📦 Inicializando productos semilla...');
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
        products = SEED_PRODUCTS;
      }

      // Normalizar estructuras antiguas (migración name/image -> title/imageUrl)
      let mutated = false;
      products = products.map(p => {
        if (!p.title && p.name) { p.title = p.name; mutated = true; }
        if (!p.imageUrl && p.image) { p.imageUrl = p.image; mutated = true; }
        return p;
      });
      if (mutated) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      }
      // Filtrar solo productos con stock > 0
      return products.filter(p => !p.stock || p.stock > 0);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Si hay error, retornar productos semilla
      return SEED_PRODUCTS;
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object|null>} - Producto encontrado o null
   */
  getById: async (id) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const products = await productsService.getAll();
      const product = products.find(p => p.id === id);

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      return product;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} - Producto creado
   */
  create: async (productData) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validaciones
    if (!isValidText(productData.title, 5)) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (!isValidText(productData.description, 10)) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (!isValidPrice(productData.price)) {
      throw new Error('El precio debe ser mayor a 0 y menor a S/ 10,000');
    }

    if (!productData.category) {
      throw new Error('Debes seleccionar una categoría');
    }

    if (!productData.sellerId && !productData.sellerEmail) {
      throw new Error('No hay usuario autenticado');
    }

    // Crear nuevo producto
    const newProduct = {
      id: generateId(),
      title: sanitizeHTML(productData.title.trim()),
      description: sanitizeHTML(productData.description.trim()),
      price: parseFloat(productData.price),
      category: productData.category,
      condition: productData.condition || 'Usado - Buen estado',
      stock: productData.stock || 1,
      imageUrl: productData.imageUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
      sellerId: productData.sellerId || (productData.sellerEmail ? productData.sellerEmail.split('@')[0] : undefined),
      sellerName: productData.sellerName || 'Vendedor',
      sellerEmail: productData.sellerEmail || null,
      createdAt: new Date().toISOString(),
      status: 'available'
    };

    try {
      // Obtener productos existentes
      const products = await productsService.getAll();

      // Agregar nuevo producto
      products.unshift(newProduct); // Agregar al inicio

      // Guardar en localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

      console.log('✅ Producto creado:', newProduct);

      return newProduct;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente
   * @param {string} id - ID del producto
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Producto actualizado
   */
  update: async (id, updates) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const products = await productsService.getAll();
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      // Actualizar producto
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

      return products[index];
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Elimina un producto
   * @param {string} id - ID del producto
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const products = await productsService.getAll();
      const filteredProducts = products.filter(p => p.id !== id);

      if (products.length === filteredProducts.length) {
        throw new Error('Producto no encontrado');
      }

      // Guardar en localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));

      console.log('🗑️ Producto eliminado:', id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos de un vendedor específico
   * @param {string} sellerId - ID del vendedor
   * @returns {Promise<Array>} - Productos del vendedor
   */
  getBySeller: async (sellerId) => {
    const products = await productsService.getAll();
    return products.filter(p => p.sellerId === sellerId);
  },

  /**
   * Filtra productos por categoría
   * @param {string} category - Categoría a filtrar
   * @returns {Promise<Array>} - Productos filtrados
   */
  getByCategory: async (category) => {
    const products = await productsService.getAll();
    return products.filter(p => p.category === category && p.status === 'available');
  },

  /**
   * Busca productos por texto
   * @param {string} query - Texto de búsqueda
   * @returns {Promise<Array>} - Productos encontrados
   */
  search: async (query) => {
    const products = await productsService.getAll();
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return products.filter(p => p.status === 'available');
    }

    return products.filter(p => 
      p.status === 'available' && 
      (!p.stock || p.stock > 0) && (
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
    );
  }
};

// Exportación nombrada para compatibilidad
export const productService = productsService;

export default productsService;
