// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ProductSkeleton from './ProductSkeleton';

const LINE_META = {
  skin: { label: 'Línea Chibi Skin' },
  tea:  { label: 'Línea Chibi Tea'  },
  todo: { label: 'Todos' }, // usado como "clear filter" -> no mostramos banner
};

const ProductList = ({
  products = [],
  isHome = false,
  gridColumns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  loading = false,
  error = '',
  activeLine = null,          // <-- NUEVO (opcional): 'skin' | 'tea' | 'todo' | null
  onClearFilter,              // <-- opcional: función para limpiar filtro si quieres un botón
}) => {
  const sectionTitle = isHome ? "PRODUCTOS RECIÉN SUBIDOS" : "TODOS NUESTROS PRODUCTOS";
  const displayProducts = isHome ? products.slice(0, 4) : products;

  const showFilterBanner =
    !!activeLine && activeLine !== 'todo' && LINE_META[activeLine];

  if (error) {
    return (
      <section className="py-10 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <p className="text-gray-600 mt-2">Por favor, inténtalo de nuevo más tarde.</p>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de filtro activo (solo en tienda) */}
        {!isHome && showFilterBanner && (
          <div
            className="mb-6 flex flex-wrap items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm font-medium text-gray-900">
              Filtrando por: <span className="underline">{LINE_META[activeLine].label}</span>
            </span>
            <span className="text-sm text-gray-500">
              {displayProducts.length} resultado{displayProducts.length === 1 ? '' : 's'}
            </span>
            {typeof onClearFilter === 'function' && (
              <button
                type="button"
                onClick={onClearFilter}
                className="ml-auto text-sm cursor-pointer hover:bg-chibi-green hover:text-black font-medium text-chibi-green hover:opacity-80"
              >
                Quitar filtro
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridColumns} gap-8`}>
          {loading
            ? Array.from({ length: isHome ? 4 : 16 }).map((_, i) => <ProductSkeleton key={i} />)
            : displayProducts.length > 0
              ? displayProducts.map((product) => <ProductCard key={product.id} product={product} />)
              : !loading && (
                  <div className="col-span-full text-center text-gray-600 text-lg">
                    No se encontraron productos.
                  </div>
                )
          }
        </div>

        {isHome && (
          <div className="text-left mt-12">
            <Link
              to="/tienda"
              className="inline-flex items-center bg-chibi-green text-white py-3 px-6 
                         hover:bg-chibi-green-dark transition-colors duration-300 text-base rounded-full shadow-md"
            >
              Ver Todos los Productos
              <FaArrowRight className="ml-2 text-lg" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
