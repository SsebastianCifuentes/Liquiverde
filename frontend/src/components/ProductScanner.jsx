import React, { useState } from 'react';
import { productService } from '../services/api';

const ProductScanner = ({ onProductScanned }) => {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await productService.scanProduct(barcode);
      
      if (result.success) {
        setMessage(`✅ ${result.product.name} escaneado correctamente!`);
        setBarcode('');
        onProductScanned(result.product);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ Error al escanear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner">
      <h3>🔍 Escanear Producto</h3>
      <form onSubmit={handleScan} className="scanner-form">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Ingresa código de barras..."
          className="barcode-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !barcode.trim()}
          className="scan-button"
        >
          {loading ? 'Escaneando...' : 'Escanear'}
        </button>
      </form>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="sample-barcodes">
        <p>Prueba con estos códigos:</p>
        <div className="barcode-list">
          <button onClick={() => setBarcode('7613034626844')}>Nesquik</button>
          <button onClick={() => setBarcode('3017620422003')}>Nutella</button>
          <button onClick={() => setBarcode('5449000000996')}>Coca-Cola</button>
          <button onClick={() => setBarcode('8076809518583')}>Pasta Barilla</button>
        </div>
      </div>
    </div>
  );
};

export default ProductScanner;