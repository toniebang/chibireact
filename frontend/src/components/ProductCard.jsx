import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoHeart } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart }) => {
  const {
    id,
    nombre,
    precio,
    oferta,
    precio_rebaja,
    imagen1,
    imagen2,
    imagen3,
  } = product || {};

  const { cart, addToCart } = useCart();
  // const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
const { isFavorite, toggleFavorite } = useFavorites();
const fav = isFavorite(id);


  useEffect(() => {
    setAdded(false);
  }, [id]);

  const getItemProductId = (item) =>
    item?.product_id ?? item?.product?.id ?? item?.id;

  const inCartByContext = useMemo(() => {
    const items = cart?.items || [];
    return items.some((it) => String(getItemProductId(it)) === String(id));
  }, [cart, id]);

  const isInCart = added || inCartByContext;

  const mainImg = imagen1 || imagen2 || imagen3 || '';
  const hoverImg = imagen2 || imagen3 || imagen1 || '';

  const displayPrice = useMemo(() => {
    if (oferta && precio_rebaja > 0) {
      return { current: precio_rebaja, original: precio };
    }
    return { current: precio, original: null };
  }, [oferta, precio_rebaja, precio]);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAdded(true);
      return;
    }
    try {
      const ok = await addToCart(id, 1);
      if (ok !== false) setAdded(true);
    } catch (err) {
      console.error('Error addToCart:', err);
    }
  };

const toggleFav = (e) => {
  e.preventDefault();
  toggleFavorite(id);
  // si quieres notificación, aquí llamas a tu NotificationContext
};

  return (
    <Link
      to={`/tienda/${id}`}
      className="group block border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200"
      title={nombre}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {oferta && (
          <span className="absolute left-2 top-2 z-10 bg-chibi-green text-white text-xs px-2 py-1 rounded-none">
            Oferta
          </span>
        )}

        <button
          onClick={toggleFav}
          aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className="absolute right-2 top-2 z-10 bg-white/90 hover:bg-white p-1.5 rounded-none text-gray-800"
        >
          {fav ? <IoHeart className="text-red-600" /> : <IoMdHeartEmpty />}
        </button>

        <div className="aspect-[4/5] bg-gray-50">
          {mainImg ? (
            <>
              <img
                src={mainImg}
                alt={nombre}
                className="w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                loading="lazy"
              />
              <img
                src={hoverImg}
                alt={`${nombre} vista 2`}
                className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">{nombre}</h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-gray-900">
            {displayPrice.current?.toLocaleString('es-ES')} XAF
          </span>
          {displayPrice.original && (
            <span className="text-sm text-gray-500 line-through">
              {displayPrice.original?.toLocaleString('es-ES')} XAF
            </span>
          )}
        </div>

        {/* Botón dinámico con fondo negro siempre */}
        {isInCart ? (
          <button
            disabled
            className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-none bg-black text-white cursor-not-allowed"
          >
            <BsCartCheck className="text-lg" />
            En carrito
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-none bg-black text-white hover:bg-gray-800"
          >
            <FaPlus className="text-xs" />
            Añadir
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
