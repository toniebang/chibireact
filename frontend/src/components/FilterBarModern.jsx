// src/components/FilterBarModern.jsx
import React, { useMemo, useId, useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { IoFilterOutline, IoChevronDown, IoClose } from 'react-icons/io5';

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
  const [open, setOpen] = useState(false); // 🔒 cerrado por defecto
  const panelId = useId();
  const panelRef = useRef(null);

  const isDirty = useMemo(() => {
    return (
      hasActiveSearch ||
      (category && String(category) !== '') ||
      onOffer === true ||
      sortKey !== 'relevance'
    );
  }, [hasActiveSearch, category, onOffer, sortKey]);

  // Chips activos (con botón de quitar)
  const chips = useMemo(() => {
    const arr = [];
    if (category) {
      const found = categories.find((c) => String(c.id) === String(category));
      arr.push({
        label: `Categoría: ${found?.nombre ?? category}`,
        onRemove: () => setCategory(''),
      });
    }
    if (onOffer) {
      arr.push({
        label: 'En oferta',
        onRemove: () => setOnOffer(false),
      });
    }
    if (sortKey && sortKey !== 'relevance') {
      const label =
        sortKey === 'price_asc'
          ? 'Precio: menor→mayor'
          : sortKey === 'price_desc'
          ? 'Precio: mayor→menor'
          : sortKey === 'date_desc'
          ? 'Novedades'
          : `Orden: ${sortKey}`;
      arr.push({
        label,
        onRemove: () => setSortKey('relevance'),
      });
    }
    if (hasActiveSearch) {
      arr.push({
        label: 'Búsqueda activa',
        onRemove: onClearFilters, // si quieres solo limpiar la búsqueda, expón un handler específico
      });
    }
    return arr;
  }, [categories, category, onOffer, sortKey, hasActiveSearch, setCategory, setOnOffer, setSortKey, onClearFilters]);

  // Accesibilidad: cerrar con Escape cuando está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section className="bg-white border border-gray-200 shadow-sm">
      {/* Barra superior: botón “Filtros” + chips activos + limpiar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 md:p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-chibi-green/60 text-chibi-green
                       bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-chibi-green rounded"
            title="Mostrar/Ocultar filtros"
          >
            <IoFilterOutline className="text-lg" />
            <span className="font-medium">Filtros</span>
            {isDirty && (
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-chibi-green">
                {chips.length}
              </span>
            )}
            <IoChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Chips */}
          {!!chips.length && (
            <div className="flex flex-wrap items-center gap-2 ml-2">
              {chips.map((c, i) => (
                <span
                  key={`${c.label}-${i}`}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-chibi-green/30 text-chibi-green bg-green-50 rounded"
                >
                  {c.label}
                  {c.onRemove && (
                    <button
                      type="button"
                      onClick={c.onRemove}
                      className="p-0.5 hover:bg-green-100 rounded"
                      aria-label={`Quitar ${c.label}`}
                    >
                      <IoClose />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Limpiar todo (incluye búsqueda si la hay) */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!isDirty || loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded disabled:opacity-50"
            title={hasActiveSearch ? 'Limpiar filtros y búsqueda' : 'Limpiar filtros'}
          >
            <FiX />
            {hasActiveSearch ? 'Limpiar todo' : 'Limpiar filtros'}
          </button>
        </div>
      </div>

      {/* Panel colapsable */}
      <div
        id={panelId}
        ref={panelRef}
        className={[
          'overflow-hidden transition-[max-height] duration-300 ease-in-out',
          open ? 'max-h-[900px]' : 'max-h-0',
        ].join(' ')}
      >
        <div className="p-3 md:p-4 border-t border-gray-100">
          {/* === Tus controles de filtro originales aquí === */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBarModern;
