// src/components/FilterBarModern.jsx
import React, { useMemo } from 'react';
import { FiX } from 'react-icons/fi';

const FilterBarModern = ({
  categories = [],
  // 🔹 indica si hay búsqueda activa en el Hero
  hasActiveSearch = false,

  // filtros
  category,
  setCategory,
  onOffer,
  setOnOffer,
  sortKey,
  setSortKey,

  // estado
  loading,

  // limpiar
  onClearFilters,
}) => {
  const isDirty = useMemo(() => {
    return (
      hasActiveSearch ||
      (category && String(category) !== '') ||
      onOffer === true ||
      sortKey !== 'relevance'
    );
  }, [hasActiveSearch, category, onOffer, sortKey]);

  return (
    <div className="bg-white border border-gray-200 p-3 md:p-4">
      <div className="flex flex-wrap items-center gap-2">

        {/* Categoría */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white"
          title="Categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {/* En oferta */}
        <button
          type="button"
          onClick={() => setOnOffer((prev) => !prev)}
          className={`px-3 py-2 text-sm border rounded-none ${
            onOffer
              ? 'bg-chibi-green text-white border-chibi-green'
              : 'bg-gray-100 text-gray-800 border-gray-300'
          }`}
        >
          {onOffer ? 'En oferta ✓' : 'En oferta'}
        </button>

        {/* Orden */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white"
          title="Ordenar por"
        >
          <option value="relevance">Ordenar por</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="date_desc">Novedades</option>
        </select>

        {/* Limpiar filtros (incluye búsqueda si la hay) */}
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!isDirty || loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-none disabled:opacity-50"
          title={hasActiveSearch ? 'Limpiar filtros y búsqueda' : 'Limpiar filtros'}
        >
          <FiX />
          {hasActiveSearch ? 'Limpiar todo' : 'Limpiar filtros'}
        </button>
      </div>
    </div>
  );
};

export default FilterBarModern;
