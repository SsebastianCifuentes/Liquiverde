import axios from 'axios';

// Configurar axios para conectar con nuestro backend
const API_BASE_URL = 'https://laughing-space-computing-machine-pxgqrj96x6gf664q-8000.app.github.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios para productos
export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Escanear producto por código de barras
  scanProduct: async (barcode) => {
    try {
      const response = await api.get(`/products/${barcode}`);
      return response.data;
    } catch (error) {
      console.error('Error scanning product:', error);
      throw error;
    }
  },
};

// Servicios para optimización
export const optimizationService = {
  // Optimizar lista de compras
  optimizeShoppingList: async (budget, preferences = [], excludedCategories = []) => {
    try {
      const response = await api.post('/optimize-shopping-list', {
        budget,
        preferences,
        excluded_categories: excludedCategories,
      });
      return response.data;
    } catch (error) {
      console.error('Error optimizing shopping list:', error);
      throw error;
    }
  },

  // Test de optimización simple
  testOptimization: async () => {
    try {
      const response = await api.get('/test-optimization');
      return response.data;
    } catch (error) {
      console.error('Error testing optimization:', error);
      throw error;
    }
  },
};

// Servicio para health check
export const healthService = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  },
};

export default api;