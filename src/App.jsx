import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import { getProducts } from './services/firebase';
import { getFromLocalStorage, saveToLocalStorage } from './services/localStorage';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home/Home'));
const Catalog = lazy(() => import('./pages/Catalog/Catalog'));
const Cart = lazy(() => import('./pages/Cart/Cart'));

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cachedProducts = getFromLocalStorage('products');
        
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
          setLoading(false);
        }

        const serviceProducts = await getProducts();
        setProducts(serviceProducts);
        saveToLocalStorage('products', serviceProducts);
        
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <LoadingSpinner />
            </div>
          }>
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
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
