import React from 'react';
import ProductCard from './ProductCard';
import { FaArrowRight } from 'react-icons/fa'; // Asegúrate de tener 'react-icons' instalado


const ProductList = ({ products, isHome }) => {
  const displayProducts = isHome ? products.slice(0, 6) : products;
  const sectionTitle = isHome ? "NUESTROS PRODUCTOS DESTACADOS" : "TODOS NUESTROS PRODUCTOS";

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light text-center mb-12">{sectionTitle}</h2>

        {/* CAMBIO APLICADO AQUÍ: grid-cols-2 para móvil */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {isHome && (
          <div className="text-left mt-12">
            <a
              href="/tienda"
              className="inline-flex items-center bg-chibi-green text-white py-3 px-6 
                         hover:bg-chibi-green-dark transition-colors duration-300 text-base shadow-md"
            >
              Ver Todos los Productos
                <FaArrowRight className="ml-2 text-lg" />
            </a>
          </div>
        )}


      </div>
    </section>
  );
};

export default ProductList;