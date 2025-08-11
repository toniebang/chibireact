// src/components/ProductSkeleton.jsx
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="border border-gray-200 p-3 animate-pulse bg-white">
      {/* Imagen */}
      <div className="w-full aspect-square bg-gray-200 mb-3" />
      {/* Título */}
      <div className="h-4 bg-gray-200 mb-2 w-3/4" />
      {/* Precio */}
      <div className="h-4 bg-gray-200 mb-1 w-1/2" />
      {/* Botón */}
      <div className="h-8 bg-gray-200 mt-3" />
    </div>
  );
};

export default ProductSkeleton;
