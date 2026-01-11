import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSparklesOutline, IoLeafOutline, IoGridOutline, IoGlobeOutline } from 'react-icons/io5';

const CategoryIcons = ({ selected, onSelect }) => {
  // líneas base siempre visibles
  const baseLines = [
    { id: 'skin', nombre: 'Línea Chibi Skin', descripcion: 'Cuidado personal y belleza', icon: IoSparklesOutline },
    { id: 'tea',  nombre: 'Línea Chibi Tea',  descripcion: 'Tés e infusiones especiales', icon: IoLeafOutline },
    // TEMPORALMENTE COMENTADO: Descomentar después de ejecutar migraciones
    // { id: 'korean', nombre: 'Productos de Corea', descripcion: 'Productos importados de Corea', icon: IoGlobeOutline },
  ];

  // "Todos" solo visible si se ha elegido algún filtro
  const showTodos = selected === 'skin' || selected === 'tea'; // || selected === 'korean';
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
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <motion.div
        className={`
          mt-6
          flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4
          sm:grid ${gridColsClass} sm:gap-3 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0
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
                "flex items-center gap-4 bg-white border p-4 text-left",
                "shrink-0 snap-start min-w-[240px] w-[65%] rounded-md",
                "sm:w-auto sm:min-w-0",
                isActive ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-chibi-green"
              ].join(' ')}
              role="listitem"
              aria-pressed={isActive}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <motion.div
                className={[
                  "flex items-center justify-center w-16 h-16 rounded-full",
                  isActive ? "bg-black text-white" : "bg-gray-100 text-chibi-green",
                ].join(' ')}
                aria-hidden="true"
                animate={{
                  backgroundColor: isActive ? "#000000" : "#f3f4f6",
                  color: isActive ? "#ffffff" : "#10b981",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Icon className="text-3xl md:text-4xl" />
              </motion.div>
              <div className="min-w-0">
                <motion.div
                  className="font-medium text-gray-900 truncate"
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.nombre}
                </motion.div>
                <motion.div
                  className="text-sm text-gray-500"
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  {item.descripcion}
                </motion.div>
              </div>
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
  );
};

export default CategoryIcons;
