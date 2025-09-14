import React, { useMemo } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const PaginationClassic = ({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
  windowSize = 2,
  className = '',
  scrollToTop = true,
  compactBreakpoint = 'md',
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

  const items = useMemo(() => {
    if (totalPages <= 0) return [];
    const set = new Set();
    set.add(1);
    set.add(totalPages);

    const start = Math.max(1, page - windowSize);
    const end = Math.min(totalPages, page + windowSize);
    for (let n = start; n <= end; n++) set.add(n);

    const sorted = Array.from(set).sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < sorted.length; i++) {
      out.push(sorted[i]);
      if (i < sorted.length - 1) {
        const curr = sorted[i];
        const next = sorted[i + 1];
        if (next - curr > 1) out.push('ellipsis');
      }
    }
    return out;
  }, [page, totalPages, windowSize]);

  const circleBtnBase =
    "inline-flex items-center justify-center w-9 h-9 text-sm border transition-colors";
  const circleBtn =
    circleBtnBase + " border-gray-300 bg-white text-gray-800 hover:bg-gray-100 rounded-full";
  const circleBtnDisabled =
    circleBtnBase + " border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed rounded-full";
  const circleBtnActive =
    circleBtnBase + " border-black bg-black text-white cursor-default rounded-full";

  const compactHidden = `${compactBreakpoint}:hidden`;
  const desktopHidden = `hidden ${compactBreakpoint}:flex`;

  return (
    <>
      {/* 📱 Compacto (móvil) */}
      <ul className={`flex items-center gap-2 ${compactHidden} ${className}`}>
        <li>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev}
            className={hasPrev ? circleBtn : circleBtnDisabled}
            aria-label="Anterior"
            title="Anterior"
          >
            <FaCaretLeft />
          </button>
        </li>

        <li>
          <span className={circleBtnActive} aria-current="page">
            {page}
          </span>
        </li>

        <li>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
            className={hasNext ? circleBtn : circleBtnDisabled}
            aria-label="Siguiente"
            title="Siguiente"
          >
            <FaCaretRight />
          </button>
        </li>
      </ul>

      {/* 💻 Completo (desktop) */}
      <ul className={`${desktopHidden} items-center gap-2 ${className}`}>
        <li>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev}
            className={hasPrev ? circleBtn : circleBtnDisabled}
            aria-label="Anterior"
            title="Anterior"
          >
            <FaCaretLeft />
          </button>
        </li>

        {items.map((it, idx) => (
          <li key={`${it}-${idx}`}>
            {it === 'ellipsis' ? (
              <span className="px-2 text-gray-500 select-none">…</span>
            ) : it === page ? (
              <span className={circleBtnActive} aria-current="page">
                {it}
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(it)}
                className={circleBtn}
                title={`Ir a página ${it}`}
                aria-label={`Ir a página ${it}`}
              >
                {it}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
            className={hasNext ? circleBtn : circleBtnDisabled}
            aria-label="Siguiente"
            title="Siguiente"
          >
            <FaCaretRight />
          </button>
        </li>
      </ul>
    </>
  );
};

export default PaginationClassic;
