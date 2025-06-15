import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { 
    id, 
    imagen1, 
    nombre, 
    precio, 
    oferta, 
    precio_rebaja, 
    categorias, 
    is_new 
  } = product;

  const getProductDetailsUrl = (productId) => `/tienda/${productId}`;

  // Función auxiliar para formatear el precio
  const formatPrice = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'N/A Fcs'; // Manejo para valores no numéricos
    }
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true // Asegura el uso de separadores de miles
    });
    return `${formatter.format(value)} Fcs`;
  };

  return (
    <div className="single-product-item text-center relative overflow-hidden group
                    transform transition-transform duration-300 hover:-translate-y-2 bg-white">
      
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

        <button
          className="absolute cursor-pointer bottom-4 right-4 bg-chibi-green text-white w-10 h-10 rounded-full flex items-center justify-center 
                     hover:bg-black transition duration-300 z-10"
          title="Añadir al carrito"
        >
          <FaShoppingCart />
        </button>
      </div>

      <div className="title p-4">
        <Link to={getProductDetailsUrl(id)} className="mi-boton block hover:text-blue-600 transition-colors duration-200">
          <h3 className="text-base font-medium mb-1 text-gray-800">{nombre}</h3>
        </Link>
        
        <ul className="gallery-filter list-inline text-center flex justify-center flex-wrap gap-2 mb-2">
          {categorias && categorias.slice(0, 2).map((categoria, index) => (
            <li key={index}>
              <span className="text-[10px] text-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                {categoria}
              </span>
            </li>
          ))}
        </ul>
        
        {oferta ? (
          <h2 className="text-lg font-semibold text-gray-800">
            {/* Usamos la función formatPrice aquí y eliminamos el signo de dólar */}
            <del className="before-rate text-gray-500 mr-2">{formatPrice(precio)}</del>
            {formatPrice(precio_rebaja)}
          </h2>
        ) : (
          <h2 className="text-lg font-semibold text-gray-800">
            {/* Usamos la función formatPrice aquí y eliminamos el signo de dólar */}
            {formatPrice(precio)}
          </h2>
        )}
      </div>
    </div>
  );
};

export default ProductCard;