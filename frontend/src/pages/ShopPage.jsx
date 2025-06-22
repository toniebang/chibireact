// src/pages/ShopPage.jsx
import React, { useState,  useMemo } from 'react';
import Filters from '../components/Filters'; // Tu componente Filters
import Header from '../components/Header';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ProductList from '../components/ProductList'; // Tu ProductList
import productsData from '../data/products'; // Los datos de tus productos
import Footer from '../components/Footer'; // Tu componente Footer
function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    onOffer: false,
    // minPrice: '',
    // maxPrice: '',
  });

  // Función para manejar el cambio en los filtros
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    // Si limpiamos la búsqueda desde el botón de limpiar filtros, necesitamos actualizar searchTerm también
    if (filterName === 'searchTerm') {
      setSearchTerm(value);
    }
  };

  // Función para manejar el cambio en la búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Lógica de filtrado y búsqueda optimizada con useMemo
  const filteredProducts = useMemo(() => {
    let currentProducts = [...productsData]; // Copia para no mutar el original

    // 1. Aplicar búsqueda
    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Aplicar filtro de categoría
    if (filters.category) {
      currentProducts = currentProducts.filter(product =>
        product.categorias.includes(filters.category)
      );
    }

    // 3. Aplicar filtro de oferta
    if (filters.onOffer) {
      currentProducts = currentProducts.filter(product => product.oferta === true);
    }

    // 4. Aplicar filtro de rango de precios (si se implementa)
    /*
    if (filters.minPrice) {
      currentProducts = currentProducts.filter(product =>
        (product.oferta ? product.precio_rebaja : product.precio) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      currentProducts = currentProducts.filter(product =>
        (product.oferta ? product.precio_rebaja : product.precio) <= parseFloat(filters.maxPrice)
      );
    }
    */

    return currentProducts;
  }, [searchTerm, filters]); // Dependencias: recalcular solo cuando searchTerm o filters cambien

  return (
    <>
    <div className="shop-page container mx-auto px-4 py-8"> {/* Contenedor principal de la tienda */}
        <Header /> {/* Componente de encabezado */}
      <Filters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="mt-8"> {/* Margen superior para separar de los filtros */}
        {filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} isHome={false} /> // isHome en false para la tienda
        ) : (
          <p className="text-center text-gray-600 text-lg">No se encontraron productos que coincidan con los filtros aplicados.</p>
        )}
      </div>

      {/* Aquí irá el componente de Paginación en el futuro */}
    </div>
      <ScrollToTopButton /> 
      <Footer></Footer>
</>
  );
}

export default ShopPage;