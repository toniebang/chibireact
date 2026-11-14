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
    <section className="relative font-montserrat bg-chibi-bone text-chibi-ink pt-24 md:pt-36 pb-7 md:pb-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-16 md:items-end">
        <div className="flex flex-col gap-[18px] md:gap-[22px]">
          <p className="chibi-eyebrow text-chibi-olive flex items-center gap-3.5">
            <span className="inline-block h-[3px] w-9 md:w-12 bg-chibi-green" aria-hidden="true" />
            Tienda online
          </p>

          <h1 className="chibi-display leading-[0.82] text-[clamp(4rem,20vw,5rem)] sm:text-[7rem] lg:text-[clamp(7.5rem,12vw,11rem)]">
            Chibi Shop
          </h1>

          <p className="text-[15px] md:text-lg leading-normal text-[#3b3d33]">
            Cremas, jabones, productos, accesorios, tés y más.
          </p>

          {/* Buscador */}
          <div className="relative max-w-[560px] rounded-full transition-shadow duration-300 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-chibi-green">
            <label htmlFor="shop-search" className="sr-only">Buscar productos</label>
            <input
              id="shop-search"
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
              placeholder="Buscar..."
              className={[
                "w-full h-[58px] md:h-[62px] bg-white text-chibi-ink placeholder:text-[#5b5d50]",
                "pl-6 pr-16 rounded-full text-base",
                "border-[1.5px] border-chibi-ink",
                "focus:outline-none transition-shadow duration-300",
                focused ? "shadow-lg" : ""
              ].join(' ')}
            />

            {/* Botón dentro del input */}
            <button
              type="button"
              onClick={() => onSearchSubmit?.()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 md:h-[46px] md:w-[46px] flex items-center justify-center bg-chibi-ink hover:bg-chibi-olive text-white rounded-full transition-colors cursor-pointer"
              aria-label="Buscar"
            >
              <IoSearch size={20} />
            </button>

            {/* Sugerencias con fade/slide */}
            {showSuggestions && (
              <div
                className={[
                  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20",
                  "bg-white border border-chibi-rule shadow-xl overflow-hidden text-left",
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

        {/* Foto de la tienda */}
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Interior de Chibi Shop en Malabo"
            className="hidden md:block w-full h-[360px] object-cover"
          />
        )}
      </div>
    </section>
  );
};

export default ShopHero;
