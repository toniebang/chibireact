// src/components/ShopHero.jsx
import React, { useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

const ShopHero = ({
  backgroundImage,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  suggestions = [],
  showSuggestions = false,
  loadingSuggestions = false,
  onSelectSuggestion,
  hideSuggestions,
}) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit?.();
    }
  };

  return (
   <section
  className="relative font-montserrat h-[30vh] md:h-[35vh] flex items-center justify-center"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido centrado */}
      <div className="relative z-10 w-full px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow">
          Encuentra tu producto
        </h1>
        <p className="mt-3 text-white/90 text-sm md:text-base">
          Busca por nombre o palabra clave
        </p>

        {/* Contenedor animado del buscador */}
        <div
          className={[
            "mt-6 mx-auto transition-all duration-300 ease-out",
            "transform will-change-transform",
            focused ? "max-w-3xl scale-[1.02]" : "max-w-2xl"
          ].join(' ')}
        >
          <div className="relative group focus-within:shadow-xl focus-within:ring-2 focus-within:ring-chibi-green rounded-full transition-shadow duration-300">
            <input
              ref={inputRef}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                // damos un pequeño margen para poder clicar una sugerencia
                setTimeout(() => {
                  hideSuggestions?.();
                  setFocused(false);
                }, 150);
              }}
              placeholder="Ej. arroz, shampoo, crema..."
              className={[
                "w-full bg-white text-gray-800",
                "pl-4 pr-12 py-3 md:py-3.5 rounded-full",
                "border border-gray-300",
                "focus:outline-none transition-all duration-300",
                focused ? "shadow-lg" : "shadow"
              ].join(' ')}
            />

            {/* Botón dentro del input */}
            <button
              type="button"
              onClick={() => onSearchSubmit?.()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-chibi-green hover:bg-green-700 text-white p-2 md:p-2.5 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <IoSearch size={18} />
            </button>

            {/* Sugerencias con fade/slide */}
            {showSuggestions && (
              <div
                className={[
                  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20",
                  "bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden",
                  "transition-all duration-200 ease-out origin-top",
                  showSuggestions ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95"
                ].join(' ')}
              >
                {loadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Cargando…</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Sin resultados</div>
                ) : (
                  <ul className="max-h-72 overflow-auto">
                    {suggestions.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onMouseDown={() => onSelectSuggestion?.(s)}
                          className="w-full px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50"
                        >
                          {s.thumb ? (
                            <img
                              src={s.thumb}
                              alt={s.nombre}
                              className="w-9 h-9 object-cover border rounded"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-gray-100 border rounded" />
                          )}
                          <span className="text-gray-800">{s.nombre}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHero;
