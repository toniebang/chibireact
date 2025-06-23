import React, { useState, useMemo } from 'react';
import Filters from '../components/Filters'; // Tu componente Filters
import Header from '../components/Header'; // Tu componente Header
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
      {/* Contenedor principal de la tienda, incluyendo el Header */}
      <div className="shop-page container mx-auto py-8">
        <Header /> {/* Asegúrate de que este Header pueda incluir la búsqueda y los iconos */}

        {/* Contenedor Flex para la barra lateral y el contenido principal */}
        <div className="flex flex-col md:flex-row mt-8 gap-8">
          {/* Barra Lateral de Filtros */}
          <aside className="w-full md:w-1/4">
            <Filters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Contenido Principal de la Tienda (Lista de Productos) */}
          <main className="w-full md:w-3/4">
            {filteredProducts.length > 0 ? (
              <ProductList
                products={filteredProducts}
                isHome={false} // isHome en false para la página de la tienda
                gridColumns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" // Define las columnas para la cuadrícula
              />
            ) : (
              <p className="text-center text-gray-600 text-lg">No se encontraron productos que coincidan con los filtros aplicados.</p>
            )}
            {/* Aquí podría ir el componente de Paginación en el futuro */}
          </main>
        </div>
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}

export default ShopPage;