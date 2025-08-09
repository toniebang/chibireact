// src/components/FilterBarModern.jsx
import React, { useEffect, useRef } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

const FilterBarModern = ({
  categories = [],
  // search
  searchTerm, setSearchTerm,
  onSearchSubmit,
  suggestions = [],
  showSuggestions = false,
  loadingSuggestions = false,
  onSelectSuggestion,
  hideSuggestions,
  // filters
  category, setCategory,
  onOffer, setOnOffer,
  sortKey, setSortKey,
  loading = false,
}) => {
  const [open, setOpen] = React.useState(false); // panel móvil
  const searchRef = useRef(null);

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, onOffer, sortKey]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit?.();
    } else if (e.key === 'Escape') {
      hideSuggestions?.();
    }
  };

  return (
    <section className="w-full">
      {/* Top row */}
      <div className="flex items-center gap-2 relative">
        {/* Search */}
        <div className="relative w-full md:max-w-md" ref={searchRef}>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => hideSuggestions?.(), 120)}
            disabled={loading}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-chibi-green disabled:opacity-60"
          />

          {/* Dropdown de sugerencias */}
          {showSuggestions && (
            <div className="absolute z-50 mt-1 left-0 right-0 border border-gray-200 bg-white shadow-sm">
              {loadingSuggestions && (
                <div className="px-3 py-2 text-sm text-gray-500">Buscando…</div>
              )}
              {!loadingSuggestions && suggestions.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">Sin coincidencias</div>
              )}
              {!loadingSuggestions && suggestions.length > 0 && (
                <ul className="max-h-72 overflow-auto">
                  {suggestions.map(item => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()} // evita blur previo
                        onClick={() => onSelectSuggestion?.(item)}
                      >
                        {item.thumb ? (
                          <img
                            src={item.thumb}
                            alt={item.nombre}
                            className="w-8 h-8 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                            —
                          </div>
                        )}
                        <span className="text-sm text-gray-800">{item.nombre}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Toggle filtros (móvil) */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="md:hidden px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-none hover:bg-gray-100 inline-flex items-center gap-2"
          aria-expanded={open}
          aria-controls="filters-panel"
        >
          <FiSliders />
          Filtros
        </button>

        {/* Controles (desktop) */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white disabled:opacity-60"
            title="Categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnOffer(v => !v)}
            disabled={loading}
            className={`px-3 py-2 text-sm border rounded-none ${
              onOffer
                ? 'bg-chibi-green text-white border-chibi-green'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            } disabled:opacity-60`}
            title="En oferta"
          >
            {onOffer ? 'En oferta ✓' : 'En oferta'}
          </button>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white disabled:opacity-60"
            title="Ordenar por"
          >
            <option value="relevance">Relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="date_desc">Novedades</option>
          </select>
        </div>
      </div>

      {/* Panel móvil */}
      <div
        id="filters-panel"
        className={`md:hidden transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${open ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        <div className="border border-gray-200 bg-white p-3 flex flex-col gap-3">
          <label className="text-xs text-gray-600">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white disabled:opacity-60"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <label className="text-xs text-gray-600">Oferta</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnOffer(v => !v)}
              disabled={loading}
              className={`px-3 py-2 text-sm border rounded-none ${
                onOffer
                  ? 'bg-chibi-green text-white border-chibi-green'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              } disabled:opacity-60`}
            >
              {onOffer ? 'En oferta ✓' : 'En oferta'}
            </button>
          </div>

          <label className="text-xs text-gray-600">Ordenar por</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-300 rounded-none bg-white disabled:opacity-60"
          >
            <option value="relevance">Relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="date_desc">Novedades</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default FilterBarModern;
