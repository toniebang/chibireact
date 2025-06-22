// src/components/Filters.jsx
import React from 'react';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';

const Filters = ({ searchTerm, onSearchChange, filters, onFilterChange }) => {
  return (
    // Eliminamos 'md:flex-row' para que siempre sea 'flex-col'
    // Y ajustamos los anchos a 'w-full' para que cada uno ocupe todo el ancho disponible
    <div className="flex flex-col gap-6 p-6 bg-white border-b border-gray-200">
      {/* SearchBar ocupa el 100% de ancho en todas las pantallas */}
      <div className="w-full">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
      {/* FilterOptions ocupa el 100% de ancho en todas las pantallas */}
      <div className="w-full">
        <FilterOptions filters={filters} onFilterChange={onFilterChange} />
      </div>
    </div>
  );
};

export default Filters;