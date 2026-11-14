// src/components/ProductSkeleton.jsx
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse bg-white" aria-hidden="true">
      {/* Imagen */}
      <div className="w-full aspect-[4/5] bg-chibi-sand" />
      <div className="p-3 sm:p-[18px] border-t border-[#e6e4d8]">
        {/* Título */}
        <div className="h-4 bg-chibi-sand mb-3 w-3/4" />
        <div className="flex items-end justify-between gap-2">
          {/* Precio */}
          <div className="h-7 bg-chibi-sand w-1/2" />
          {/* Botón */}
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-chibi-sand" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
