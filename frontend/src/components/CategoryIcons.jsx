import React, { useState } from 'react';
import { IoSparklesOutline, IoLeafOutline, IoGridOutline } from 'react-icons/io5';

const CategoryIcons = ({ selected, onSelect }) => {
  // líneas base siempre visibles
  const baseLines = [
    { id: 'skin', nombre: 'Línea Chibi Skin', descripcion: 'Cuidado personal y belleza', icon: IoSparklesOutline },
    { id: 'tea',  nombre: 'Línea Chibi Tea',  descripcion: 'Tés e infusiones especiales', icon: IoLeafOutline },
  ];

  // “Todos” solo visible si se ha elegido una de las dos líneas
  const showTodos = selected === 'skin' || selected === 'tea';
  const lines = showTodos
    ? [...baseLines, { id: 'todo', nombre: 'Todos', descripcion: 'Quitar filtro de línea', icon: IoGridOutline }]
    : baseLines;

  const [activeIndex, setActiveIndex] = useState(0);

  // dentro de CategoryIcons
const handleSelect = (id) => {
  // Si ya está activa, no hacemos nada (evita vaciar resultados)
  if (selected === id) return;
  onSelect?.(id);
};


  const handleScroll = (e) => {
    const el = e.currentTarget;
    const newIndex = Math.round(
      (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (lines.length - 1)
    );
    setActiveIndex(isFinite(newIndex) ? newIndex : 0);
  };

  // grid responsive ajusta columnas si hay 2 o 3 items
  const gridColsClass = lines.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div
        className={`
          mt-6
          flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4
          sm:grid ${gridColsClass} sm:gap-3 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0
          no-scrollbar touch-scroll
        `}
        onScroll={handleScroll}
        role="list"
        aria-label="Categorías"
      >
        {lines.map((line) => {
          const Icon = line.icon;
          const isActive = selected === line.id;
          return (
            <button
              key={line.id}
              type="button"
              onClick={() => handleSelect(line.id)}
              className={[
                "flex items-center gap-4 bg-white border p-4 text-left transition-all",
                "shrink-0 snap-start min-w-[240px] w-[65%] rounded-md",
                "sm:w-auto sm:min-w-0",
                isActive ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-chibi-green"
              ].join(' ')}
              role="listitem"
              aria-pressed={isActive}
            >
              <div
                className={[
                  "flex items-center justify-center w-16 h-16 rounded-full",
                  isActive ? "bg-black text-white" : "bg-gray-100 text-chibi-green",
                ].join(' ')}
                aria-hidden="true"
              >
                <Icon className="text-3xl md:text-4xl" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{line.nombre}</div>
                <div className="text-sm text-gray-500">{line.descripcion}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Indicador solo en mobile */}
      {/* <div className="flex justify-center mt-2 space-x-1 sm:hidden">
        {lines.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full ${idx === activeIndex ? 'bg-chibi-green' : 'bg-gray-300'}`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default CategoryIcons;
