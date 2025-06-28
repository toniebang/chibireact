// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard'; // Asegúrate de que la ruta sea correcta si ProductCard está en el mismo directorio o uno diferente
import { FaArrowRight } from 'react-icons/fa';
import { useProducts } from '../context/ProductContext'; // <--- Importa el hook custom
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom para navegación


const ProductList = ({ isHome }) => {
  // 1. Usa el custom hook para acceder a los datos del contexto
  const { products, loading, error } = useProducts();

  // 2. Lógica para mostrar productos (destacados o todos)
  // Ahora, displayProducts usará los 'products' obtenidos del contexto
  const displayProducts = isHome ? products.slice(0, 6) : products;
  const sectionTitle = isHome ? "NUESTROS PRODUCTOS DESTACADOS" : "TODOS NUESTROS PRODUCTOS";

  // 3. Manejo de estados de carga y error
  if (loading) {
    return (
      <section className="py-10 text-center">
        <p className="text-xl text-gray-700">Cargando productos...</p>
        {/* Aquí podrías añadir un spinner o un esqueleto de carga si lo deseas */}
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <p className="text-gray-600 mt-2">Por favor, inténtalo de nuevo más tarde.</p>
      </section>
    );
  }

  // Si no hay productos después de cargar
  if (products.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-xl text-gray-700">No se encontraron productos.</p>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light text-center mb-12">{sectionTitle}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Mapea sobre displayProducts que ahora viene del contexto */}
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {isHome && (
          <div className="text-left mt-12">
            <Link // Usamos Link de react-router-dom en lugar de 'a' tag puro
              to="/tienda"
              className="inline-flex items-center bg-chibi-green text-white py-3 px-6 
                         hover:bg-chibi-green-dark transition-colors duration-300 text-base shadow-md"
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