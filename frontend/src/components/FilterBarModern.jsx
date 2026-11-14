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
  koreanOnly,
  setKoreanOnly,
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
      koreanOnly === true ||
      sortKey !== 'relevance'
    );
  }, [hasActiveSearch, category, onOffer, koreanOnly, sortKey]);

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
    if (koreanOnly) {
      arr.push({
        label: 'Productos de Corea',
        onRemove: () => setKoreanOnly(false),
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
  }, [categories, category, onOffer, koreanOnly, sortKey, hasActiveSearch, setCategory, setOnOffer, setKoreanOnly, setSortKey, onClearFilters]);

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
    <section className="border-y border-chibi-rule text-chibi-ink">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-2.5 py-3 md:py-3.5">
        {/* Botón Filtros */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2.5 h-[46px] px-5 rounded-full cursor-pointer
                     bg-chibi-ink text-white text-sm font-semibold
                     hover:bg-chibi-olive focus:outline-none focus-visible:ring-2 focus-visible:ring-chibi-green focus-visible:ring-offset-2
                     transition-colors"
          title="Mostrar/Ocultar filtros"
        >
          <IoFilterOutline className="text-base" />
          <span>Filtros</span>
          {isDirty && (
            <span className="text-[11px] leading-none px-2 py-1 rounded-full bg-chibi-green text-chibi-ink">
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
                className="inline-flex items-center gap-1 pl-3.5 pr-1 h-9 text-[13px]
                           border border-chibi-ink text-chibi-ink bg-white rounded-full"
              >
                {c.label}
                {c.onRemove && (
                  <button
                    type="button"
                    onClick={c.onRemove}
                    className="h-7 w-7 flex items-center justify-center hover:bg-chibi-sand rounded-full transition-colors cursor-pointer"
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
            className="inline-flex items-center gap-2 h-[46px] px-[18px] text-sm font-medium rounded-full cursor-pointer
                       border-[1.5px] border-[#8b8d80] text-[#3b3d33] bg-transparent hover:border-chibi-ink hover:text-chibi-ink
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
        <div className="pt-4 pb-5 border-t border-chibi-rule">
          {/* Controles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Categoría */}
            <label className="inline-flex items-center gap-2 text-sm text-[#3b3d33]">
              <span className="hidden sm:inline">Categoría</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 px-4 text-sm rounded-full bg-white text-chibi-ink
                           ring-1 ring-[#8b8d80] focus:ring-2 focus:ring-chibi-ink outline-none
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
                'h-11 px-[18px] text-sm font-medium rounded-full border transition-colors cursor-pointer',
                onOffer
                  ? 'bg-chibi-ink text-white border-chibi-ink'
                  : 'bg-white text-chibi-ink border-[#8b8d80] hover:border-chibi-ink',
              ].join(' ')}
            >
              {onOffer ? 'En oferta ✓' : 'En oferta'}
            </button>

            {/* Productos de Corea */}
            <button
              type="button"
              onClick={() => setKoreanOnly((prev) => !prev)}
              className={[
                'h-11 px-[18px] text-sm font-medium rounded-full border transition-colors cursor-pointer',
                koreanOnly
                  ? 'bg-chibi-ink text-white border-chibi-ink'
                  : 'bg-white text-chibi-ink border-[#8b8d80] hover:border-chibi-ink',
              ].join(' ')}
            >
              {koreanOnly ? 'De Corea ✓' : 'De Corea'}
            </button>

            {/* Orden */}
            <label className="inline-flex items-center gap-2 text-sm text-[#3b3d33]">
              <span className="hidden sm:inline">Ordenar</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="h-11 px-4 text-sm rounded-full bg-white text-chibi-ink
                           ring-1 ring-[#8b8d80] focus:ring-2 focus:ring-chibi-ink outline-none
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
