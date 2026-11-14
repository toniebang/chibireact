// src/components/PaginationBar.jsx
// Paginación de la tienda: barra de progreso + Anterior / Página 01 / 02 / Siguiente.
// Misma interfaz que PaginationClassic (page, totalPages, hasPrev, hasNext, onPageChange).
import React, { useMemo } from 'react';

const Arrow = ({ dir = 'right' }) => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'right' ? (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ) : (
      <>
        <path d="M19 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </>
    )}
  </svg>
);

const pad = (n) => String(n).padStart(2, '0');

const PaginationBar = ({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
  windowSize = 2,
  scrollToTop = true,
  className = '',
}) => {
  const clamp = (p) => Math.max(1, Math.min(totalPages, p));

  const handlePageChange = (next) => {
    const target = clamp(next);
    if (target !== page) {
      onPageChange(target);
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Números para saltar de página (solo cuando hay más de dos)
  const items = useMemo(() => {
    if (totalPages <= 2) return [];
    const set = new Set([1, totalPages]);
    const start = Math.max(1, page - windowSize);
    const end = Math.min(totalPages, page + windowSize);
    for (let n = start; n <= end; n++) set.add(n);
    const sorted = Array.from(set).sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < sorted.length; i++) {
      out.push(sorted[i]);
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) out.push('ellipsis');
    }
    return out;
  }, [page, totalPages, windowSize]);

  const progress = Math.min(100, Math.max(0, (page / Math.max(1, totalPages)) * 100));

  const counter = (
    <p className="flex items-baseline gap-2.5 md:gap-3 text-chibi-ink" aria-live="polite">
      <span className="text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#4a4c41]">Página</span>
      <span className="chibi-display leading-none text-[44px] md:text-[56px]">{pad(page)}</span>
      <span className="chibi-display leading-none text-2xl md:text-[28px] text-[#5b5d50]">/ {pad(totalPages)}</span>
    </p>
  );

  const prevDisabled = !hasPrev;
  const nextDisabled = !hasNext;

  return (
    <nav aria-label="Paginación" className={`flex flex-col gap-[18px] md:gap-[22px] w-full ${className}`}>
      <div className="h-[3px] bg-chibi-rule" aria-hidden="true">
        <div className="h-full bg-chibi-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Escritorio */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          disabled={prevDisabled}
          className="chibi-btn chibi-btn-ghost-ink disabled:border-chibi-rule disabled:text-[#8b8d80] disabled:bg-transparent disabled:cursor-not-allowed"
        >
          <Arrow dir="left" />
          Anterior
        </button>

        {counter}

        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          disabled={nextDisabled}
          className="chibi-btn chibi-btn-ink disabled:bg-transparent disabled:border-chibi-rule disabled:text-[#8b8d80] disabled:cursor-not-allowed"
        >
          Siguiente
          <Arrow />
        </button>
      </div>

      {/* Móvil */}
      <div className="md:hidden flex flex-col gap-[18px]">
        <div className="flex items-center justify-between gap-3">
          {counter}
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={prevDisabled}
            aria-label="Página anterior"
            className="h-[52px] w-[52px] rounded-full border-[1.5px] border-chibi-ink text-chibi-ink flex items-center justify-center cursor-pointer disabled:border-chibi-rule disabled:text-[#8b8d80] disabled:cursor-not-allowed"
          >
            <Arrow dir="left" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          disabled={nextDisabled}
          className="chibi-btn chibi-btn-ink w-full disabled:bg-transparent disabled:border-chibi-rule disabled:text-[#8b8d80] disabled:cursor-not-allowed"
        >
          Siguiente página
          <Arrow />
        </button>
      </div>

      {/* Salto directo a una página (solo con más de dos páginas) */}
      {items.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {items.map((it, idx) => (
            <li key={`${it}-${idx}`}>
              {it === 'ellipsis' ? (
                <span className="px-1 text-[#5b5d50] select-none">…</span>
              ) : it === page ? (
                <span aria-current="page" className="inline-flex h-11 min-w-11 px-2 items-center justify-center rounded-full bg-chibi-ink text-white text-sm font-semibold">
                  {it}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(it)}
                  aria-label={`Ir a página ${it}`}
                  className="inline-flex h-11 min-w-11 px-2 items-center justify-center rounded-full border border-chibi-rule text-chibi-ink text-sm font-semibold cursor-pointer hover:border-chibi-ink"
                >
                  {it}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default PaginationBar;
