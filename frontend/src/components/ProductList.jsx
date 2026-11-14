// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ProductSkeleton from './ProductSkeleton';

const LINE_META = {
  skin: { label: 'Línea Chibi Skin' },
  tea:  { label: 'Línea Chibi Tea'  },
  todo: { label: 'Todos' }, 
};

const ProductList = ({
  products = [],
  isHome = false,
  gridColumns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  loading = false,
  error = '',
  activeLine = null,          
  onClearFilter,              
}) => {
  const sectionTitle = isHome ? "PRODUCTOS RECIÉN SUBIDOS" : "TODOS NUESTROS PRODUCTOS";
  const displayProducts = isHome ? products.slice(0, 4) : products;

  const showFilterBanner =
    !!activeLine && activeLine !== 'todo' && LINE_META[activeLine];

  if (error) {
    return (
      <section className="py-10" role="alert">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-200 border-l-[3px] border-l-red-500 bg-white px-5 py-4">
            <p className="text-base font-medium text-red-600">Error: {error}</p>
            <p className="text-sm text-gray-600 mt-1">Por favor, inténtalo de nuevo más tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
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
        <div className={`grid ${gridColumns} gap-3 sm:gap-5 lg:gap-6`}>
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
          <div className="text-left mt-10 md:mt-12">
            <Link
              to="/tienda"
              className="chibi-btn chibi-btn-ink w-full sm:w-auto"
            >
              Ver Todos los Productos
              <FaArrowRight className="text-sm" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
