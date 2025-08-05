// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductContext = createContext();

export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/`);
      const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.results;
      if (!fetchedProducts) {
        throw new Error("La respuesta de la API no contiene una lista de productos válida.");
      }
      setProducts(fetchedProducts);
      console.log("Productos cargados:", fetchedProducts);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const contextValue = {
    products,
    loading,
    error,
    fetchProducts,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};