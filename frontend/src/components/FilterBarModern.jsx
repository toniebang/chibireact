// src/components/FilterBarModern.jsx
import React, { useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const FilterBarModern = ({
  categories = [],
  // search
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  // autocomplete
  suggestions = [],
  showSuggestions,
  loadingSuggestions,
  onSelectSuggestion,
  hideSuggestions,
  // filters
  category,
  setCategory,
  onOffer,
  setOnOffer,
  sortKey,
  setSortKey,
  loading,
  // clear
  onClearFilters, // 👈 NUEVO
}) => {
  const isDirty = useMemo(() => {
    return (
      (searchTerm && searchTerm.trim() !== '') ||
      (category && String(category) !== '') ||
      onOffer === true ||
      sortKey !== 'relevance'
    );
  }, [searchTerm, category, onOffer, sortKey]);

  return (
    <div className="bg-white border border-gray-200 p-3 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => suggestions.length && hideSuggestions && null}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-chibi-green"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit?.();
            }}
          />

          {/* Sugerencias */}
          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <div
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 shadow-sm max-h-72 overflow-auto"
              onMouseLeave={hideSuggestions}
            >
              {loadingSuggestions ? (
                <div className="px-3 py-2 text-sm text-gray-500">Buscando…</div>
              ) : (
                suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSuggestion?.(s)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {s.thumb ? (
                      <span className="inline-flex items-center gap-2">
                        <img src={s.thumb} alt="" className="w-6 h-6 object-cover" />
                        {s.nombre}
                      </span>
                    ) : (
                      s.nombre
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Filtros rápidos + Orden + Limpiar */}
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
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          {/* En oferta */}
          <button
            onClick={() => setOnOffer(prev => !prev)}
            className={`px-3 py-2 text-sm border rounded-none ${
              onOffer ? 'bg-chibi-green text-white border-chibi-green' : 'bg-gray-100 text-gray-800 border-gray-300'
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

          {/* Limpiar filtros */}
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!isDirty || loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-none disabled:opacity-50"
            title="Limpiar filtros"
          >
            <FiX />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBarModern;
