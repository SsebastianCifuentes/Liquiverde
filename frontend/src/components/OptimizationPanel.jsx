import React, { useState } from 'react';
import { optimizationService } from '../services/api';

const OptimizationPanel = ({ products }) => {
  const [budget, setBudget] = useState(5000);
  const [preferences, setPreferences] = useState('');
  const [excluded, setExcluded] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    
    if (products.length === 0) {
      setError('Primero escanea algunos productos');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const preferencesArray = preferences.split(',').filter(p => p.trim());
      const excludedArray = excluded.split(',').filter(e => e.trim());

      const result = await optimizationService.optimizeShoppingList(
        budget,
        preferencesArray,
        excludedArray
      );

      setResults(result);
    } catch (error) {
      setError('Error al optimizar la lista de compras');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await optimizationService.testOptimization();
      setResults(result.optimized_list);
    } catch (error) {
      setError('Error en prueba rápida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="optimization-panel">
      <h3>🎯 Optimizar Lista de Compras</h3>
      
      <form onSubmit={handleOptimize} className="optimization-form">
        <div className="form-group">
          <label>Presupuesto ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min="100"
            step="100"
            required
          />
        </div>

        <div className="form-group">
          <label>Preferencias (separadas por coma)</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="ej: organic, bio, local"
          />
        </div>

        <div className="form-group">
          <label>Excluir categorías (separadas por coma)</label>
          <input
            type="text"
            value={excluded}
            onChange={(e) => setExcluded(e.target.value)}
            placeholder="ej: snacks, bebidas alcoholicas"
          />
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            disabled={loading || products.length === 0}
            className="optimize-button"
          >
            {loading ? 'Optimizando...' : 'Optimizar Lista'}
          </button>
          
          <button 
            type="button" 
            onClick={handleQuickTest}
            disabled={loading || products.length === 0}
            className="test-button"
          >
            Prueba Rápida
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="optimization-results">
          <h4>✅ Lista Optimizada</h4>
          
          <div className="results-summary">
            <div className="summary-item">
              <span>Total: </span>
              <strong>${results.total_cost}</strong>
            </div>
            <div className="summary-item">
              <span>Presupuesto usado: </span>
              <strong>${results.budget_used}</strong>
            </div>
            <div className="summary-item">
              <span>Restante: </span>
              <strong>${results.budget_remaining}</strong>
            </div>
            <div className="summary-item">
              <span>Sustentabilidad total: </span>
              <strong>{results.total_sustainability}</strong>
            </div>
          </div>

          <div className="optimized-products">
            <h5>Productos seleccionados:</h5>
            {results.items.map((item, index) => (
              <div key={index} className="optimized-product">
                <span className="product-name">{item.product.name}</span>
                <span className="product-price">${item.product.price}</span>
                <span className="product-sustainability">
                  🌱 {item.product.sustainability_score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationPanel;