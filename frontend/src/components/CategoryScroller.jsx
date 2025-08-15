import React, { useRef } from 'react';

const CategoryScroller = ({ categories = [], selected, onSelect }) => {
  const ref = useRef(null);
  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-900">Explora por categoría</h2>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => scrollBy(-320)} className="px-3 py-2 border hover:bg-gray-50 rounded-none">◀</button>
          <button onClick={() => scrollBy(320)} className="px-3 py-2 border hover:bg-gray-50 rounded-none">▶</button>
        </div>
      </div>

      {/* scroll horizontal, 3 cards visibles aprox */}
      <div
        ref={ref}
        className="mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(String(c.id))}
            className={`snap-start min-w-[calc(33.333%-8px)] sm:min-w-[280px] md:min-w-[320px]
                        bg-white border ${String(selected) === String(c.id) ? 'border-black' : 'border-gray-200'}
                        hover:shadow-sm transition-shadow text-left`}
          >
            <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden">
              {c.cover ? (
                <img src={c.cover} alt={c.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
              )}
            </div>
            <div className="p-3">
              <div className="font-medium text-gray-900">{c.nombre}</div>
              {c.descripcion ? (
                <div className="text-xs text-gray-600 line-clamp-2 mt-1">{c.descripcion}</div>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroller;
