import React from 'react';
import { IoSparklesOutline, IoLeafOutline, IoGridOutline } from 'react-icons/io5';

/**
 * Muestra líneas fijas como iconos grandes (sin scroll).
 * Props:
 *  - selected: 'skin' | 'tea' | 'todo' | ''
 *  - onSelect: (id) => void
 */
const CategoryIcons = ({ selected, onSelect }) => {
  const lines = [
    {
      id: 'skin',
      nombre: 'Línea Chibi Skin',
      descripcion: 'Cuidado personal y belleza',
      icon: IoSparklesOutline,
    },
    {
      id: 'tea',
      nombre: 'Línea Chibi Tea',
      descripcion: 'Tés e infusiones especiales',
      icon: IoLeafOutline,
    },
    {
      id: 'todo',
      nombre: 'Todos',
      descripcion: 'Todos los productos',
      icon: IoGridOutline,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {lines.map((line) => {
          const Icon = line.icon;
          const isActive = selected === line.id;
          return (
            <button
              key={line.id}
              type="button"
              onClick={() => onSelect?.(line.id)}
              className={[
                "flex items-center gap-4 w-full cursor-pointer",
                "bg-white border transition-all",
                isActive ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-300",
                "p-4 text-left"
              ].join(' ')}
            >
              <div
                className={[
                  "flex items-center justify-center",
                  "w-16 h-16 rounded-full",
                  isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-chibi-green"
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
    </div>
  );
};

export default CategoryIcons;
