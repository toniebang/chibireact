// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md flex items-center space-x-2">
      <label htmlFor="search" className="sr-only">Buscar productos</label>
      <input
        type="text"
        id="search"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chibi-green"
      />
      <button
        onClick={() => onSearchChange('')} // Botón para limpiar la búsqueda
        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
        aria-label="Limpiar búsqueda"
      >
        X
      </button>
    </div>
  );
};

export default SearchBar;