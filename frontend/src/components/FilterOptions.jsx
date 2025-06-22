// src/components/FilterOptions.jsx
import React, { useEffect, useState } from 'react';
import allProducts from '../data/products'; // Importamos todos los productos para extraer categorías

const FilterOptions = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Extraer categorías únicas de todos los productos
    const uniqueCategories = new Set();
    allProducts.forEach(product => {
      product.categorias.forEach(cat => uniqueCategories.add(cat));
    });
    // Añade 'Todo' como primera opción y ordena alfabéticamente
    setCategories(['Todo', ...Array.from(uniqueCategories).sort()]);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Filtrar por:</h3>

      {/* Filtro por Categoría - Ahora como lista horizontal */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
        <div className="flex flex-wrap gap-2"> {/* Usamos flex-wrap para que se ajuste en pantallas pequeñas */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat === 'Todo' ? '' : cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${
                  filters.category === (cat === 'Todo' ? '' : cat)
                    ? 'bg-[var(--color-chibi-green)] text-white shadow-md' // Estilo activo
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Estilo inactivo
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por Oferta - Se mantiene igual */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="offer-filter"
          checked={filters.onOffer}
          onChange={(e) => onFilterChange('onOffer', e.target.checked)}
          className="h-4 w-4 text-[var(--color-chibi-green)] border-gray-300 rounded focus:ring-[var(--color-chibi-green)]"
        />
        <label htmlFor="offer-filter" className="ml-2 block text-sm text-gray-900">
          Solo Ofertas
        </label>
      </div>

      {/* Botón para limpiar filtros */}
      <button
        onClick={() => {
          onFilterChange('category', '');
          onFilterChange('onOffer', false);
          onFilterChange('searchTerm', ''); // Limpia también la búsqueda
        }}
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
      >
        Limpiar Filtros
      </button>
    </div>
  );
};

export default FilterOptions;