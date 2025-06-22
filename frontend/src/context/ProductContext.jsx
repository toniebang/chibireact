// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios'; // Importa Axios

// Define la URL base de la API usando la variable de entorno de Vite
// Accedemos a través de import.meta.env y usamos el prefijo VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Crear el Contexto
const ProductContext = createContext({
  products: [],
  loading: false,
  error: null,
  fetchProducts: () => {},
});

// 2. Crear el Proveedor del Contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos Axios para hacer la llamada a la API
      // Aquí estamos asumiendo que el endpoint para obtener todos los productos es '/products'
      // Asegúrate de que esta ruta coincida con tu backend
      const response = await axios.get(`${API_BASE_URL}/productos`);
      setProducts(response.data);
      console.log("Productos cargados:", response.data); // Para depuración
    } catch (err) {
      console.error("Error al cargar productos:", err);
      if (axios.isAxiosError(err)) { // Usa isAxiosError para un mejor type narrowing
        if (err.response) {
          setError(`Error del servidor: ${err.response.status} - ${err.response.data?.message || 'Error desconocido'}`);
        } else if (err.request) {
          setError("No se recibió respuesta del servidor. Por favor, comprueba tu conexión a internet.");
        } else {
          setError(`Error al configurar la petición: ${err.message}`);
        }
      } else {
        setError(`Ocurrió un error inesperado: ${err.message}`);
      }
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
};

// 3. Crear un Custom Hook para un uso más fácil del Contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export default ProductContext;