import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Icono de carrito
import { IoHeart } from 'react-icons/io5';      // Icono de corazón (asegúrate de tener 'react-icons' instalado)

const ProductCard = ({ product }) => {
  const {
    id,
    imagen1,
    nombre,
    precio,
    oferta,
    precio_rebaja,
    
    is_new
  } = product;

  const getProductDetailsUrl = (productId) => `/tienda/${productId}`;

  const formatPrice = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'N/A Fcs';
    }
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
    return `${formatter.format(value)} Fcs`;
  };

  return (
    <div className="single-product-item relative overflow-hidden group
                    transform transition-transform duration-300 hover:-translate-y-2 bg-white
                    flex flex-col">

      <div className="img-holder relative w-full h-72 overflow-hidden">
        <Link to={getProductDetailsUrl(id)} className="block">
          <img
            alt={nombre}
            src={imagen1}
            className="w-full h-full object-cover object-center transition-transform duration-300"
          />
        </Link>

        {is_new && (
          <div className="new-product absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 z-10">
            <p>Nuevo</p>
          </div>
        )}

        {oferta && (
          <div className="offer-product absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 z-10">
            <p>En oferta</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex space-x-2 z-10 ">
          <button
            className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                       border cursor-pointer border-gray-400 hover:bg-black hover:text-white transition duration-300" // ¡COMENTARIO ELIMINADO DE ESTA LÍNEA!
            title="Añadir al carrito"
          >
            <FaShoppingCart className="text-base " />
          </button>
          <button
            className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                     cursor-pointer   border border-gray-400 hover:bg-black hover:text-white transition duration-300" // ¡COMENTARIO ELIMINADO DE ESTA LÍNEA!
            title="Añadir a favoritos"
          >
            <IoHeart className="text-base " />
          </button>
        </div>
      </div>

      <div className="title p-4 text-left">
        <Link to={getProductDetailsUrl(id)} className="mi-boton block hover:text-blue-600 transition-colors duration-200">
          <h3 className="text-sm font-medium mb-1 text-gray-800">{nombre}</h3>
        </Link>

        {oferta ? (
          <h2 className="text-sm font-bold text-black mt-2">
            <del className="before-rate text-red-400 mr-2 ">{formatPrice(precio)}</del>
            {formatPrice(precio_rebaja)}
          </h2>
        ) : (
          <h2 className="text-sm font-bold text-black mt-2">
            {formatPrice(precio)}
          </h2>
        )}
      </div>
    </div>
  );
};

export default ProductCard;