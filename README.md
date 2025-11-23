# UTP Marketplace

Plataforma de marketplace para la comunidad universitaria UTP que permite a estudiantes comprar y vender productos entre ellos.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Brewall/UTP-Marketplace.git
cd UTP-Marketplace
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución del Proyecto

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilación para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `build/`

### Vista Previa de Producción

```bash
npm run preview
```

## Credenciales de Acceso

El sistema utiliza autenticación simulada con correos institucionales UTP:

- Formato de correo: `u########@utp.edu.pe`
- Ejemplo: `u20201234@utp.edu.pe`
- Contraseña: cualquier texto (mínimo 6 caracteres)

## Características Principales

- Autenticación con correos institucionales UTP
- Catálogo de productos con filtros y búsqueda
- Publicación y gestión de productos
- Carrito de compras
- Historial de órdenes
- Persistencia de datos en LocalStorage

## Tecnologías

- React 18.3.1
- React Router 6.28.0
- Vite 7.2.4
- Sass 1.94.2
- Bootstrap 5.3.8

## Estructura del Proyecto

El proyecto sigue una arquitectura modular basada en features. Para información detallada sobre la organización del código, patrones de diseño, sistema de estilos y consideraciones para migración a Firebase, consulte la [Documentación Técnica Completa](./docs/TECHNICAL_GUIDE.md).

