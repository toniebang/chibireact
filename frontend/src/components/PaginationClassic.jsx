import React, { useMemo } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const PaginationClassic = ({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
  windowSize = 2, // ±2
  className = '',
}) => {
  const pageRange = useMemo(() => {
    const nums = [];
    for (let n = 1; n <= totalPages; n++) {
      if (n === page || (n > page - (windowSize + 1) && n < page + (windowSize + 1))) {
        nums.push(n);
      }
    }
    return nums;
  }, [page, totalPages, windowSize]);

  const circleBtnBase =
    "inline-flex items-center justify-center w-9 h-9 text-sm border transition-colors";
  const circleBtn =
    circleBtnBase + " border-gray-300 bg-white text-gray-800 hover:bg-gray-100 rounded-full";
  const circleBtnActive =
    circleBtnBase + " border-black bg-black text-white cursor-default rounded-full";

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {hasPrev && (
        <li>
          <button
            onClick={() => onPageChange(page - 1)}
            className={circleBtn}
            aria-label="Anterior"
            title="Anterior"
          >
            <FaCaretLeft />
          </button>
        </li>
      )}

      {pageRange.map((n) => (
        <li key={n}>
          {n === page ? (
            <span className={circleBtnActive} aria-current="page">
              {n}
            </span>
          ) : (
            <button
              onClick={() => onPageChange(n)}
              className={circleBtn}
              title={`Ir a página ${n}`}
            >
              {n}
            </button>
          )}
        </li>
      ))}

      {hasNext && (
        <li>
          <button
            onClick={() => onPageChange(page + 1)}
            className={circleBtn}
            aria-label="Siguiente"
            title="Siguiente"
          >
            <FaCaretRight />
          </button>
        </li>
      )}
    </ul>
  );
};

export default PaginationClassic;
