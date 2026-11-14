import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSparklesOutline, IoLeafOutline, IoGridOutline, IoGlobeOutline } from 'react-icons/io5';

const CategoryIcons = ({ selected, onSelect }) => {
  // líneas base siempre visibles
  const baseLines = [
    { id: 'skin', nombre: 'Línea Chibi Skin', descripcion: 'Cuidado personal y belleza', icon: IoSparklesOutline },
    { id: 'tea',  nombre: 'Línea Chibi Tea',  descripcion: 'Tés e infusiones especiales', icon: IoLeafOutline },
    { id: 'korean', nombre: 'Productos de Corea', descripcion: 'Productos importados de Corea', icon: IoGlobeOutline },
  ];

  // "Todos" solo visible si se ha elegido algún filtro
  const showTodos = selected === 'skin' || selected === 'tea' || selected === 'korean';
  const allItems = showTodos
    ? [...baseLines, { id: 'todo', nombre: 'Todos', descripcion: 'Quitar filtro', icon: IoGridOutline }]
    : baseLines;

  const [activeIndex, setActiveIndex] = useState(0);

  // dentro de CategoryIcons
const handleSelect = (item) => {
  // Si ya está activa, no hacemos nada (evita vaciar resultados)
  if (selected === item.id) return;
  onSelect?.(item.id);
};


  const handleScroll = (e) => {
    const el = e.currentTarget;
    const newIndex = Math.round(
      (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (allItems.length - 1)
    );
    setActiveIndex(isFinite(newIndex) ? newIndex : 0);
  };

  // grid responsive ajusta columnas según cantidad de items
  const gridColsClass = allItems.length === 3 ? 'sm:grid-cols-3' : allItems.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-chibi-bone">
     <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        className={`
          flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5
          sm:grid ${gridColsClass} sm:gap-5 sm:overflow-visible sm:pb-5 sm:mx-0 sm:px-0
          no-scrollbar touch-scroll
        `}
        onScroll={handleScroll}
        role="list"
        aria-label="Categorías"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = selected === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={[
                "flex items-center gap-3 sm:gap-[18px] text-left cursor-pointer",
                "shrink-0 snap-start h-[52px] px-[18px] sm:h-auto sm:min-h-24 sm:px-6 sm:py-5",
                "border-t-[3px] border-chibi-ink transition-colors duration-200",
                isActive ? "bg-chibi-ink text-white" : "bg-white text-chibi-ink hover:bg-chibi-sand",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-chibi-green focus-visible:ring-offset-2"
              ].join(' ')}
              role="listitem"
              aria-pressed={isActive}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`chibi-display leading-none text-2xl sm:text-[44px] ${isActive ? 'text-chibi-green' : 'text-chibi-olive'}`}
                aria-hidden="true"
              >
                {item.id === 'todo' ? <Icon className="text-xl sm:text-3xl" /> : String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex flex-col gap-1">
                <span className="chibi-display leading-none text-[22px] sm:text-[28px] whitespace-nowrap">{item.nombre}</span>
                <span className={`hidden sm:block text-[13px] ${isActive ? 'text-chibi-mist' : 'text-[#4a4c41]'}`}>{item.descripcion}</span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Indicador solo en mobile */}
      {/* <div className="flex justify-center mt-2 space-x-1 sm:hidden">
        {allItems.map((_, idx) => (
          <motion.span
            key={idx}
            className={`h-2 w-2 rounded-full`}
            animate={{
              backgroundColor: idx === activeIndex ? '#10b981' : '#d1d5db'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div> */}
     </div>
    </div>
  );
};

export default CategoryIcons;
