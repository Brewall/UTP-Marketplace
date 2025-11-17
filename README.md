# UTP Marketplace

Marketplace universitario para la comunidad UTP: compra y venta de libros, tecnología y materiales académicos entre estudiantes. Es una aplicación (SPA) en React con diseño responsive, carrito con persistencia y datos de ejemplo.

## Tecnologías

- React 19 (Hooks)
- React Router DOM v7 (enrutamiento SPA)
- Bootstrap 5 y Bootstrap Icons (interfaz e iconografía)
- Sass/SCSS con módulos (estilos)
- Firebase (configuración y datos de ejemplo)
- LocalStorage (persistencia de carrito y caché de productos)
- Create React App (react-scripts)

## Requisitos

- Node.js 18 LTS o 20
- npm 9 o superior

## Ejecutar en local

PowerShell (Windows):

```powershell
# Instalar dependencias
npm install

# (Opcional) Configurar variables de entorno
Copy-Item .env.example .env

# Iniciar el servidor de desarrollo
npm start

# La aplicación estará disponible en:
# http://localhost:3000
```

macOS/Linux (opcional):

```bash
npm install
cp .env.example .env
npm start
# http://localhost:3000
```

## Pruebas

```bash
npm test
```

## Build de producción

```bash
npm run build
```

## Estructura del proyecto (resumen)

- `src/pages/*`: páginas principales (Home, Catalog, Cart)
- `src/components/*`: componentes reutilizables (Header, ProductCard, LoadingSpinner)
- `src/services/*`: servicios como `firebase.js` y `localStorage.js`
- `src/styles/*`: variables, mixins y estilos globales
- `src/App.scss`: estilos base de la aplicación

## Seguridad

- Guía de seguridad: [docs/SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md)
