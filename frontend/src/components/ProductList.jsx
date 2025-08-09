// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isHome, gridColumns, loading, error }) => {
  console.log('[ProductList] source = props', products);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Cargando productos…</div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">{error}</div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No se encontraron productos.
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridColumns || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isHome={isHome}
        />
      ))}
    </div>
  );
};

export default ProductList;
