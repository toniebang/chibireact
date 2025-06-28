import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Icono de carrito
import { IoHeart } from 'react-icons/io5';      // Icono de corazón

const ProductCard = ({ product }) => {
  const {
    id,
    imagen1,
    nombre,
    precio,
    oferta,
    precio_rebaja,
    is_new, // Este campo es calculado en el Serializer de Django (SerializerMethodField)
    
    // Campos adicionales del modelo Productos de Django:
    disponible, // Booleano: indica si el producto debe mostrarse o no (publicar)
    stock,      // Booleano: indica si el producto está en stock
    // prioridad, // Integer: generalmente para ordenamiento en el backend, no se muestra en la tarjeta
    // categoria, // Array de IDs de categorías (si tu serializador envía las IDs).
                // Podrías usar 'categoria_nombres' si tu serializador lo expone para mostrar los nombres.
    // descripcion, // Text: la descripción completa del producto, más adecuada para la página de detalles
    // lista_caracteristicas, // String: lista de detalles, también más adecuada para la página de detalles
    
    // --> CAMPOS ADICIONALES SOLICITADOS PARA DETALLES <---
    imagen2,     // ImageField: segunda imagen, disponible para galería en la página de detalles
    imagen3,     // ImageField: tercera imagen, disponible para galería en la página de detalles
    fecha_subida, // DateField: fecha de publicación, disponible para mostrar en detalles
  } = product;

  // URL para la página de detalles de un producto específico
  const getProductDetailsUrl = (productId) => `/tienda/${productId}`;

  // Función para formatear el precio
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

  // No mostrar el producto si 'disponible' es false (aunque tu ProductList debería filtrar esto idealmente)
  if (!disponible) {
    return null; 
  }

  return (
    <div className="single-product-item relative overflow-hidden group
                    transform transition-transform duration-300 hover:-translate-y-2 bg-white
                    flex flex-col">

      {/* Contenedor de la imagen del producto */}
      <div className="img-holder relative w-full h-72 overflow-hidden">
        <Link to='/detalles/' className="block">
        {/* <Link to={getProductDetailsUrl(id)} className="block"> */}
          <img
            alt={nombre}
            src={imagen1}
            className="w-full h-full object-cover object-center transition-transform duration-300"
          />
        </Link>

        {/* Etiqueta de "Nuevo" */}
        {is_new && (
          <div className="new-product absolute top-3 left-3 bg-chibi-green text-white rounded-full text-[9px] font-semibold p-2 z-10">
            <p>Nuevo</p>
          </div>
        )}

        {/* Etiqueta de "En oferta" */}
        {oferta && (
          <div className="offer-product absolute top-3 right-3 bg-red-600 text-white rounded-full text-[9px] font-semibold p-2 z-10">
            <p>Rebajas</p>
          </div>
        )}

        {/* Indicador de "Agotado" si no hay stock */}
        {!stock && (
            <div className="absolute inset-0 flex items-center justify-start text-red-500 text-base font-bold px-2 py-2 z-20">
                <p className='bg-amber-300 px-2'>Agotado</p>
            </div>
        )}

        {/* Botones de acción (Carrito, Favoritos) */}
        <div className="absolute bottom-4 left-4 flex space-x-2 z-10 ">
          <button
            className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                       border cursor-pointer border-gray-400 hover:bg-black hover:text-white transition duration-300"
            title="Añadir al carrito"
            disabled={!stock} // Deshabilita si no hay stock
          >
            <FaShoppingCart className="text-base" />
          </button>
          <button
            className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                      cursor-pointer border border-gray-400 hover:bg-black hover:text-white transition duration-300"
            title="Añadir a favoritos"
        
          >
            <IoHeart className="text-base" />
          </button>
        </div>
      </div>

      {/* Título y precios del producto */}
      <div className="title p-4 text-left flex-grow">
        <Link to={getProductDetailsUrl(id)} className="mi-boton block hover:text-blue-600 transition-colors duration-200">
          <h3 className="text-sm font-medium mb-1 text-gray-800">{nombre}</h3>
        </Link>

        {/* Lógica para mostrar precio normal o precio de oferta */}
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
      {/* Añade un div de relleno para mantener la consistencia de altura si no hay precio de oferta */}
      {!oferta && <div className="h-[1.5rem]"></div>}

    </div>
  );
};

export default ProductCard;