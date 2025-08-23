// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ProductSkeleton from './ProductSkeleton';

const ProductList = ({ products = [], isHome = false, gridColumns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4", loading = false, error = '' }) => {
  const sectionTitle = isHome ? "PRODUCTOS RECIÉN SUBIDOS" : "TODOS NUESTROS PRODUCTOS";
  const displayProducts = isHome ? products.slice(0, 4) : products; // Home limita a 4; Tienda muestra todos los que vengan

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
        {/* {!isHome && <h2 className="text-2xl font-light text-center mb-12">{sectionTitle}</h2>} */}

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
