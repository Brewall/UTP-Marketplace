# Guía Técnica - UTP Marketplace

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Sistema de Estilos](#sistema-de-estilos)
4. [Patrones de Diseño](#patrones-de-diseño)
5. [Gestión de Estado](#gestión-de-estado)
6. [Servicios y Persistencia](#servicios-y-persistencia)
7. [Migración a Firebase](#migración-a-firebase)
8. [Buenas Prácticas](#buenas-prácticas)

---

## Arquitectura del Proyecto

### Patrón Feature-Based

El proyecto utiliza una arquitectura modular basada en features (características), donde cada funcionalidad importante está encapsulada en su propia carpeta con sus componentes, páginas, servicios y estilos.

```
src/
├── features/          # Módulos de funcionalidad
│   ├── auth/         # Autenticación
│   ├── catalog/      # Catálogo de productos
│   ├── product/      # Gestión de productos
│   ├── cart/         # Carrito de compras
│   └── orders/       # Órdenes
├── components/       # Componentes compartidos
├── services/         # Servicios globales
├── context/          # Contextos de React
├── utils/            # Utilidades
└── styles/           # Sistema de estilos globales
```

### Ventajas de esta Arquitectura

- **Escalabilidad**: Fácil agregar nuevas features sin afectar el código existente
- **Mantenibilidad**: Código organizado por dominio de negocio
- **Reutilización**: Componentes y servicios bien definidos
- **Testabilidad**: Cada feature puede testearse independientemente

---

## Estructura de Carpetas

### /src/features

Cada feature contiene su propia estructura interna:

```
features/
└── catalog/
    ├── components/      # Componentes específicos del catálogo
    ├── hooks/          # Hooks personalizados
    ├── services/       # Servicios del catálogo
    ├── CatalogPage.jsx # Página principal
    └── CatalogPage.module.scss
```

### /src/components

Componentes compartidos entre features:

```
components/
└── layout/
    ├── Navbar.jsx
    ├── Footer.jsx
    ├── AppLayout.jsx
    └── PublicLayout.jsx
```

### /src/services

Servicios globales de la aplicación:

- **auth.service.js**: Autenticación y gestión de sesiones
- **products.service.js**: CRUD de productos

### /src/context

Contextos de React para estado global:

- **AuthContext.jsx**: Estado de autenticación
- **CartContext.jsx**: Estado del carrito (dentro de features/cart)

### /src/utils

Utilidades reutilizables:

- **validators.js**: Validaciones centralizadas
- **formatters.js**: Formateo de datos (moneda, fechas, IDs)

---

## Sistema de Estilos

### Arquitectura Sass 7-1

El proyecto utiliza el patrón 7-1 adaptado para organizar los estilos:

```
styles/
├── settings/        # Variables globales
├── tools/          # Mixins y funciones
├── base/           # Reset y tipografía base
├── utilities/      # Clases de utilidad
├── vendors/        # Bootstrap y librerías externas
└── main.scss       # Punto de entrada
```

### Variables Globales

Definidas en `settings/_variables.scss`:

```scss
// Colores institucionales UTP
$primary-color: #741111;
$secondary-color: #333333;

// Sistema de espaciado (base 8px)
$spacing-xs: 0.5rem;
$spacing-sm: 1rem;
$spacing-md: 1.5rem;
$spacing-lg: 2rem;
$spacing-xl: 3rem;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

### Mixins Principales

Definidos en `tools/_mixins.scss`:

```scss
// Flexbox
@include flex-center;
@include flex-between;

// Sombras (niveles 1-5)
@include shadow(3);

// Responsive
@include respond-below(lg);
@include respond-above(md);

// Transiciones
@include transition(transform);
```

### Funciones Modernas

Definidas en `tools/_functions.scss`:

```scss
// Ajustar luminosidad (reemplaza darken/lighten)
tone($color, $amount)

// Transparencia
alpha($color, $opacity)

// Conversiones
rem($pixels)
em($pixels)
```

### CSS Modules

Cada componente tiene su propio archivo `.module.scss`:

```scss
// Importación automática de variables/mixins vía vite.config.js
.container {
  @include flex-center;
  background: $primary-color;
  padding: $spacing-md;
}
```

**Configuración en vite.config.js**:

```javascript
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
        @use "src/styles/settings" as *;
        @use "src/styles/tools" as *;
      `
    }
  }
}
```

---

## Patrones de Diseño

### 1. Service Layer Pattern

Los servicios encapsulan la lógica de acceso a datos:

```javascript
// products.service.js
const productsService = {
  async getAll() {
    await simulateDelay(300);
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  async create(productData) {
    // Validaciones
    if (!isValidPrice(productData.price)) {
      throw new Error('Precio inválido');
    }
    
    // Operación
    const products = await this.getAll();
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    
    return newProduct;
  }
};
```

### 2. Context + Reducer Pattern

Para estado complejo:

```javascript
// CartContext.jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // Lógica de agregado
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      // Lógica de eliminación
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // Implementación del provider
};
```

### 3. Custom Hooks Pattern

Reutilización de lógica:

```javascript
// useCatalogFilters.js
export function useCatalogFilters(products) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.includes(search) && 
      (!category || p.category === category)
    );
  }, [products, search, category]);
  
  return { filteredProducts, search, setSearch, category, setCategory };
}
```

### 4. Loader Pattern (React Router)

Protección de rutas:

```javascript
// router.jsx
function requireAuth() {
  const stored = sessionStorage.getItem('utp_user');
  if (!stored) {
    return redirect('/bienvenida');
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    loader: requireAuth,
    children: [/* rutas protegidas */]
  }
]);
```

---

## Gestión de Estado

### Estado Local (useState)

Para estado de componente simple:

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Estado Global (Context API)

Para estado compartido entre componentes:

**AuthContext**: Usuario autenticado, login, logout
**CartContext**: Items del carrito, cantidades, totales

### Persistencia

**sessionStorage**: Sesión de usuario (se limpia al cerrar navegador)
**localStorage**: Productos, carrito, órdenes (persiste entre sesiones)

```javascript
// Patrón de carga desde storage
useEffect(() => {
  const stored = localStorage.getItem(`cart_${userId}`);
  if (stored) {
    setItems(JSON.parse(stored));
  }
}, [userId]);

// Patrón de persistencia automática
useEffect(() => {
  localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
}, [items, userId]);
```

---

## Servicios y Persistencia

### Estructura de Servicios

Cada servicio sigue una estructura consistente:

```javascript
// Clave de almacenamiento
const STORAGE_KEY = 'utp_marketplace_products';

// Datos semilla (iniciales)
const SEED_DATA = [/* datos iniciales */];

// Servicio
const service = {
  async getAll() { /* implementación */ },
  async getById(id) { /* implementación */ },
  async create(data) { /* implementación */ },
  async update(id, data) { /* implementación */ },
  async delete(id) { /* implementación */ }
};

export default service;
```

### Validaciones Centralizadas

En `utils/validators.js`:

```javascript
// Validar email institucional
export function isValidUTPEmail(email) {
  return /^u\d{8,9}@utp\.edu\.pe$/.test(email);
}

// Validar precio
export function isValidPrice(price) {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num < 10000;
}

// Sanitizar HTML
export function sanitizeHTML(text) {
  return text.replace(/<[^>]*>/g, '');
}
```

### Formateo de Datos

En `utils/formatters.js`:

```javascript
// Formatear moneda
export function formatCurrency(amount) {
  return `S/ ${amount.toFixed(2)}`;
}

// Generar ID único
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## Migración a Firebase

### Estado Actual

El proyecto está **80% preparado** para migración a Firebase. La arquitectura de servicios está diseñada para facilitar esta transición.

### Preparación Existente

1. **Servicios desacoplados**: Lógica de negocio separada de persistencia
2. **Async/await**: Todas las operaciones son asíncronas
3. **Validaciones centralizadas**: Reutilizables en cliente y servidor

### Pasos para Migración

#### 1. Configurar Firebase

```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "utp-marketplace.firebaseapp.com",
  projectId: "utp-marketplace",
  storageBucket: "utp-marketplace.appspot.com",
  messagingSenderId: "123456789",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### 2. Migrar auth.service.js

**Antes (LocalStorage)**:
```javascript
login: async (email, password) => {
  await simulateDelay(300);
  const user = { id: email.split('@')[0], email };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}
```

**Después (Firebase)**:
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

login: async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email
  };
}
```

#### 3. Migrar products.service.js

**Antes (LocalStorage)**:
```javascript
getAll: async () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
}
```

**Después (Firebase)**:
```javascript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

getAll: async () => {
  const q = query(collection(db, 'products'), where('stock', '>', 0));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

#### 4. Migrar CartContext

El CartContext puede mantener estado local pero sincronizar con Firestore:

```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Persistir carrito en Firestore
useEffect(() => {
  if (!user) return;
  
  const cartRef = doc(db, 'carts', user.id);
  setDoc(cartRef, { items: state.items }, { merge: true });
}, [state.items, user]);
```

### Estructura de Firestore Recomendada

```
firestore/
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── name: string
│       ├── createdAt: timestamp
│       └── institution: string
│
├── products/
│   └── {productId}/
│       ├── title: string
│       ├── description: string
│       ├── price: number
│       ├── category: string
│       ├── stock: number
│       ├── sellerId: string (ref)
│       ├── imageUrl: string
│       └── createdAt: timestamp
│
├── orders/
│   └── {orderId}/
│       ├── userId: string (ref)
│       ├── items: array
│       ├── total: number
│       ├── status: string
│       └── createdAt: timestamp
│
└── carts/
    └── {userId}/
        └── items: array
```

### Security Rules de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer su propia información
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Productos: todos pueden leer, solo el dueño puede escribir
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.sellerId;
    }
    
    // Órdenes: solo el usuario dueño puede acceder
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Carritos: solo el usuario dueño puede acceder
    match /carts/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Autenticación con Firebase

#### Crear Usuario

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';

register: async (email, password, name) => {
  // Crear cuenta en Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Crear documento de usuario en Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    name,
    institution: 'UTP',
    createdAt: serverTimestamp()
  });
  
  return userCredential.user;
}
```

#### Observar Estado de Autenticación

```javascript
// En AuthContext.jsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      setUser({ id: firebaseUser.uid, ...userDoc.data() });
    } else {
      setUser(null);
    }
    setLoading(false);
  });
  
  return unsubscribe;
}, []);
```
---

## Buenas Prácticas

### Nomenclatura

**Componentes**: PascalCase
```javascript
ProductCard.jsx
CatalogPage.jsx
```

**Hooks**: camelCase con prefijo "use"
```javascript
useCart.js
useCatalogFilters.js
```

**Servicios**: camelCase con sufijo ".service"
```javascript
auth.service.js
products.service.js
```

**Estilos**: igual al componente + .module.scss
```javascript
ProductCard.module.scss
CatalogPage.module.scss
```

### Organización de Imports

```javascript
// 1. Librerías externas
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Servicios y contextos
import { productService } from '@/services/products.service';
import { useAuth } from '@/context/AuthContext';

// 3. Componentes
import ProductCard from './components/ProductCard';

// 4. Estilos
import styles from './CatalogPage.module.scss';

// 5. Assets e íconos
import { FaSearch } from 'react-icons/fa';
```

### Manejo de Errores

```javascript
try {
  setLoading(true);
  const result = await service.operation();
  setData(result);
} catch (error) {
  console.error('Error descriptivo:', error);
  setError(error.message || 'Error genérico');
} finally {
  setLoading(false);
}
```

### Optimización

**useMemo** para cálculos costosos:
```javascript
const filteredProducts = useMemo(() => {
  return products.filter(/* lógica compleja */);
}, [products, filters]);
```

**useCallback** para funciones que se pasan como props:
```javascript
const handleSubmit = useCallback((data) => {
  // Lógica
}, [dependencies]);
```

### Accesibilidad

- Usar etiquetas semánticas HTML5
- Incluir atributos `alt` en imágenes
- Usar `aria-label` cuando sea necesario
- Navegación por teclado funcional

### Performance

- Lazy loading de rutas (React.lazy)
- Imágenes optimizadas (WebP, tamaños apropiados)
- Code splitting automático (Vite)
- Memoización de componentes costosos

---

## Recursos Adicionales

### Documentación Oficial

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Sass Guidelines](https://sass-lang.com/guide)


**Última actualización**: Noviembre 2025
