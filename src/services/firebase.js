
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase desde variables de entorno (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "utp-marketplace-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "utp-marketplace-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "utp-marketplace-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getProducts = async () => {
  try {
    console.log('Cargando productos de ejemplo...');
    
    // Siempre retornar productos de ejemplo para desarrollo
    const sampleProducts = getSampleProducts();
    console.log(`${sampleProducts.length} productos cargados correctamente`);
    return sampleProducts;
    
  } catch (error) {
    console.error('Error cargando productos:', error);
    return getSampleProducts();
  }
};

// Productos de ejemplo para desarrollo
const getSampleProducts = () => [
  {
    id: '1',
    name: 'Cálculo Diferencial e Integral',
    description: 'Libro de cálculo en excelente estado, incluye ejercicios resueltos y teoría completa. Perfecto para estudiantes de ingeniería.',
    price: 45.00,
    category: 'Libros',
    seller: 'Juan Pérez',
    condition: 'Como nuevo',
    image: 'https://image.isu.pub/230405012526-9f6c55a22d26b3a61aa2796785f3e6b8/jpg/page_1_social_preview.jpg',
    rating: 4.8,
    stock: 3
  },
  {
    id: '2',
    name: 'Laptop Dell Inspiron 15',
    description: 'Laptop perfecta para estudios universitarios, 8GB RAM, 256GB SSD, procesador Intel i5. Incluye mochila y mouse.',
    price: 1200.00,
    category: 'Tecnología',
    seller: 'María García',
    condition: 'Usado - Buen estado',
    image: 'https://hiraoka.com.pe/media/catalog/product/1/2/123120_2.jpeg?quality=80&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560',
    rating: 4.5,
    stock: 1
  },
  {
    id: '3',
    name: 'Kit Arduino Uno R3 Completo',
    description: 'Kit completo para proyectos de electrónica. Incluye Arduino, sensores, LEDs, resistencias y manual de proyectos.',
    price: 85.00,
    category: 'Electrónica',
    seller: 'Carlos López',
    condition: 'Nuevo',
    image: 'https://www.pcarts.com/media/catalog/product/cache/9fcfe7a6c46ccb7ee12c530821a0c752/c/a/caja_abierta_1.jpg',
    rating: 4.9,
    stock: 5
  },
  {
    id: '4',
    name: 'Física Universitaria - Sears Zemansky',
    description: 'Volumen 1 y 2 en perfecto estado. Incluye solucionario y problemas adicionales.',
    price: 60.00,
    category: 'Libros',
    seller: 'Ana Rodríguez',
    condition: 'Poco uso',
    image: 'https://www.ingebook.com/ib/pimg/Ingebook/00100_0000008719_18375.JPG',
    rating: 4.7,
    stock: 2
  },
  {
    id: '5',
    name: 'Calculadora Científica TI-84 Plus',
    description: 'Calculadora gráfica Texas Instruments, perfecta para matemáticas avanzadas y estadística.',
    price: 95.00,
    category: 'Material Escolar',
    seller: 'Roberto Silva',
    condition: 'Seminueva',
    image: 'https://i5.walmartimages.com/seo/Texas-Instruments-TI-84-Plus-Graphing-Calculator-10-Digit-LCD_193f9f4d-8302-4c30-aae5-d88fe408b215.c28afd0adf70ca5dea22ccb82505bd99.jpeg',
    rating: 4.6,
    stock: 4
  },
  {
    id: '6',
    name: 'Tableta Gráfica Wacom Intuos',
    description: 'Tableta gráfica perfecta para diseño y arquitectura. Incluye stylus y software.',
    price: 150.00,
    category: 'Tecnología',
    seller: 'Laura Martínez',
    condition: 'Excelente estado',
    image: 'https://oechsle.vteximg.com.br/arquivos/ids/9287013/imageUrl_2.jpg?v=637913943959900000',
    rating: 4.8,
    stock: 2
  },
  {
    id: '7',
    name: 'Química General - Petrucci',
    description: 'Libro de química general, edición actualizada. Incluye problemas resueltos y laboratorio virtual.',
    price: 55.00,
    category: 'Libros',
    seller: 'Diego Herrera',
    condition: 'Como nuevo',
    image: 'https://sbslibreria.vtexassets.com/arquivos/ids/5067650-800-450?v=638853721092430000&width=800&height=450&aspect=true',
    rating: 4.4,
    stock: 3
  },
  {
    id: '8',
    name: 'Mochila Impermeable para Laptop',
    description: 'Mochila resistente al agua con compartimento para laptop hasta 15.6", múltiples bolsillos.',
    price: 35.00,
    category: 'Accesorios',
    seller: 'Sofía Vargas',
    condition: 'Nuevo',
    image: 'https://oechsle.vteximg.com.br/arquivos/ids/12918318/image-1d6aba3a44594f6996b7bbf4114a67d8.jpg?v=638065658006130000',
    rating: 4.9,
    stock: 6
  },
  {
    id: '9',
    name: 'Microscopio Digital USB',
    description: 'Microscopio digital para laboratorios de biología y investigación. Conecta directamente a la computadora.',
    price: 120.00,
    category: 'Ciencia',
    seller: 'Miguel Ángel',
    condition: 'Poco uso',
    image: 'https://epyelectronica.com/wp-content/uploads/Microscopio-Digital-Usb-1600x-Zoom-Optico-HD-8-Leds.jpg',
    rating: 4.7,
    stock: 1
  },
  {
    id: '10',
    name: 'Set de Dibujo Técnico Completo',
    description: 'Set profesional para dibujo técnico y arquitectura. Incluye reglas, compás, escuadras y transportador.',
    price: 25.00,
    category: 'Material Escolar',
    seller: 'Carolina Ruiz',
    condition: 'Nuevo',
    image: 'https://m.media-amazon.com/images/I/81cVBz+s-xL.jpg',
    rating: 4.5,
    stock: 8
  },
  {
    id: '11',
    name: 'Proyector Epson para Presentaciones',
    description: 'Proyector HD perfecto para presentaciones académicas y trabajos en grupo. Incluye cable HDMI y VGA.',
    price: 200.00,
    category: 'Tecnología',
    seller: 'Andrés Castro',
    condition: 'Buen estado',
    image: 'https://mediaserver.goepson.com/ImConvServlet/imconv/fdfe78826feeba2491e24370d54535050ec02143/1200Wx1200H?use=banner&hybrisId=B2C&assetDescr=g7500u_w_02',
    rating: 4.3,
    stock: 1
  },
  {
    id: '12',
    name: 'Estación de Soldadura para Electrónica',
    description: 'Estación completa para proyectos de electrónica. Temperatura regulable y punta intercambiable.',
    price: 75.00,
    category: 'Electrónica',
    seller: 'Javier Méndez',
    condition: 'Usado - Funciona perfecto',
    image: 'https://ediselts.com/cdn/shop/products/D_709246-MPE33052031748_112019-B_e47396b7-11b6-45e7-a692-b56fce44998c.jpg?v=1672029189',
    rating: 4.6,
    stock: 2
  }
];