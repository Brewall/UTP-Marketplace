import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Cart from './pages/Cart/Cart';
import { getProducts } from './services/firebase';
import { getFromLocalStorage, saveToLocalStorage } from './services/localStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Iniciando carga de productos...');
        
        const cachedProducts = getFromLocalStorage('products');
        
        if (cachedProducts && cachedProducts.length > 0) {
          console.log('📦 Productos cargados desde cache:', cachedProducts.length);
          setProducts(cachedProducts);
          setLoading(false);
        }

        const serviceProducts = await getProducts();
        console.log('🚀 Productos cargados del servicio:', serviceProducts.length);
        
        setProducts(serviceProducts);
        saveToLocalStorage('products', serviceProducts);
        
      } catch (error) {
        console.error('❌ Error en App.js:', error);
      } finally {
        setLoading(false);
        console.log('✅ Carga de productos completada');
      }
    };

    loadProducts();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  products={products.slice(0, 6)} 
                  loading={loading} 
                />
              } 
            />
            <Route 
              path="/catalog" 
              element={
                <Catalog 
                  products={products} 
                  loading={loading} 
                />
              } 
            />
            <Route 
              path="/cart" 
              element={<Cart />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
