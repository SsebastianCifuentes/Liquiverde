import React from 'react';

const ProductList = ({ products, onClear }) => {
  if (products.length === 0) {
    return (
      <div className="product-list">
        <h3>📦 Productos Escaneados</h3>
        <p className="empty-message">No hay productos escaneados aún.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h3>📦 Productos Escaneados ({products.length})</h3>
        <button onClick={onClear} className="clear-button">
          Limpiar Lista
        </button>
      </div>
      
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="brand">{product.brand}</p>
              <div className="product-stats">
                <span className="price">${product.price}</span>
                <span className={`sustainability ${getSustainabilityClass(product.sustainability_score)}`}>
                  🌱 {product.sustainability_score}
                </span>
              </div>
              <p className="barcode">Código: {product.barcode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Función helper para clases de sustentabilidad
const getSustainabilityClass = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

export default ProductList;