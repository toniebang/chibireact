import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isHome }) => {
  const displayProducts = isHome ? products.slice(0, 6) : products;
  const sectionTitle = isHome ? "NUESTROS PRODUCTOS DESTACADOS" : "TODOS NUESTROS PRODUCTOS";

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light text-center mb-12">{sectionTitle}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
        
        {isHome && (
          <div className="text-center mt-12">
            {/* Clases actualizadas para que coincidan con el estilo chibi-green */}
            <a 
              href="/tienda" 
              className="inline-block bg-chibi-green text-white font-bold py-2 px-6.5 text-sm 
                         hover:bg-black transition duration-600 ease-in-out"
            >
              Ver Todos los Productos
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;