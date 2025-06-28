// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductContext = createContext({
  products: [],
  loading: false,
  error: null,
  fetchProducts: () => {},
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/productos`);
      
      // --- CAMBIO CLAVE AQUÍ ---
      // Accede a la propiedad 'results' si existe, si no, usa response.data directamente
      const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.results;

      // Un chequeo adicional por si 'results' también es undefined o null en algún caso
      if (!fetchedProducts) {
          throw new Error("La respuesta de la API no contiene una lista de productos válida.");
      }
      // --- FIN DEL CAMBIO CLAVE ---

      setProducts(fetchedProducts);
      console.log("Productos cargados:", fetchedProducts); // Para depuración, ahora loguea el array real
    } catch (err) {
      console.error("Error al cargar productos:", err);
      if (axios.isAxiosError(err)) {
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

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export default ProductContext;