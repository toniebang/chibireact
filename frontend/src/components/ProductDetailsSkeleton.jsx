// src/components/ProductDetailsSkeleton.jsx
import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {/* Galería / Imagen principal */}
      <div>
        <div className="bg-gray-200 w-full aspect-square" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="w-full aspect-square bg-gray-200" />
          <div className="w-full aspect-square bg-gray-200" />
          <div className="w-full aspect-square bg-gray-200" />
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="h-7 bg-gray-200 w-3/4 mb-4" />   {/* Título */}
        <div className="h-6 bg-gray-200 w-1/4 mb-4" />   {/* Precio */}
        <div className="space-y-2 mb-4">                 {/* Descripción */}
          <div className="h-4 bg-gray-200" />
          <div className="h-4 bg-gray-200 w-5/6" />
        </div>
        <div className="flex gap-3">                     {/* Botones */}
          <div className="h-10 bg-gray-200 w-36" />
          <div className="h-10 bg-gray-200 w-36" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
