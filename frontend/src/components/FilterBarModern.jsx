// src/components/FilterBarModern.jsx
import React, { useMemo, useId, useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { IoFilterOutline, IoChevronDown, IoClose } from 'react-icons/io5';

const FilterBarModern = ({
  categories = [],
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
  const [open, setOpen] = useState(false);
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

  // Chips activos
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
          ? 'Precio: menor → mayor'
          : sortKey === 'price_desc'
          ? 'Precio: mayor → menor'
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
        onRemove: onClearFilters,
      });
    }
    return arr;
  }, [categories, category, onOffer, sortKey, hasActiveSearch, setCategory, setOnOffer, setSortKey, onClearFilters]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section className="bg-white border border-gray-200/80 shadow-sm rounded-xl">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-2 p-3 md:p-4">
        {/* Botón Filtros */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                     border border-chibi-green/40 text-chibi-green bg-white
                     hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-chibi-green
                     transition-colors"
          title="Mostrar/Ocultar filtros"
        >
          <IoFilterOutline className="text-base" />
          <span className="font-medium">Filtros</span>
          {isDirty && (
            <span className="ml-1 text-[11px] leading-none px-2 py-1 rounded-full bg-green-100 text-chibi-green">
              {chips.length}
            </span>
          )}
          <IoChevronDown className={`text-base transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Chips activos */}
        {!!chips.length && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((c, i) => (
              <span
                key={`${c.label}-${i}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px]
                           border border-chibi-green/30 text-chibi-green bg-green-50 rounded-full
                           shadow-sm"
              >
                {c.label}
                {c.onRemove && (
                  <button
                    type="button"
                    onClick={c.onRemove}
                    className="p-1 hover:bg-green-100 rounded-full transition-colors"
                    aria-label={`Quitar ${c.label}`}
                  >
                    <IoClose className="text-[14px]" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Limpiar */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!isDirty || loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full
                       border border-gray-300 bg-gray-50 hover:bg-gray-100
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={hasActiveSearch ? 'Limpiar filtros y búsqueda' : 'Limpiar filtros'}
          >
            <FiX className="text-[14px]" />
            {hasActiveSearch ? 'Limpiar todo' : 'Limpiar filtros'}
          </button>
        </div>
      </div>

      {/* Panel colapsable */}
      <div
        id={panelId}
        ref={panelRef}
        className={[
          'overflow-hidden transition-all duration-300 ease-out',
          open ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        aria-hidden={!open}
      >
        <div className="px-3 md:px-4 pb-4 border-t border-gray-100">
          {/* Controles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Categoría */}
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="hidden sm:inline">Categoría</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg bg-white
                           ring-1 ring-gray-300 focus:ring-2 focus:ring-chibi-green outline-none
                           transition-shadow"
                title="Categoría"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>

            {/* En oferta */}
            <button
              type="button"
              onClick={() => setOnOffer((prev) => !prev)}
              className={[
                'px-3 py-2 text-sm rounded-full border transition-colors',
                onOffer
                  ? 'bg-chibi-green text-white border-chibi-green shadow-sm'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              {onOffer ? 'En oferta ✓' : 'En oferta'}
            </button>

            {/* Orden */}
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="hidden sm:inline">Ordenar</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg bg-white
                           ring-1 ring-gray-300 focus:ring-2 focus:ring-chibi-green outline-none
                           transition-shadow"
                title="Ordenar por"
              >
                <option value="relevance">Por defecto</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="date_desc">Novedades</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBarModern;
