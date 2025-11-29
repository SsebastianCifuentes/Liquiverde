import React, { useState, useEffect } from 'react';
import ProductScanner from '../components/ProductScanner';
import ProductList from '../components/ProductList';
import OptimizationPanel from '../components/OptimizationPanel';
import { productService } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductScanned = (newProduct) => {
    setProducts(prev => {
      // Evitar duplicados
      if (prev.some(p => p.barcode === newProduct.barcode)) {
        return prev;
      }
      return [...prev, newProduct];
    });
  };

  const handleClearProducts = () => {
    setProducts([]);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home">
      <div className="container">
        <div className="main-content">
          <div className="left-panel">
            <ProductScanner onProductScanned={handleProductScanned} />
            <ProductList 
              products={products} 
              onClear={handleClearProducts}
            />
          </div>
          
          <div className="right-panel">
            <OptimizationPanel products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;