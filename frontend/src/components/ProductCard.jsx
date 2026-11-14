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
  e.stopPropagation();
  toggleFavorite(id);
 
};

  return (
    <Link
      to={`/tienda/${id}`}
      className="group relative flex flex-col bg-white transition-shadow duration-200 hover:shadow-lg"
      title={nombre}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {oferta && (
          <span className="absolute left-0 top-2.5 sm:top-4 z-10 bg-chibi-green text-chibi-ink text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] px-2.5 py-1.5 sm:px-3">
            Oferta
          </span>
        )}

        <button
          type="button"
          onClick={toggleFav}
          aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          aria-pressed={fav}
          className="absolute right-1 top-1 sm:right-2 sm:top-2 z-10 h-11 w-11 flex items-center justify-center cursor-pointer"
        >
          <span className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-chibi-bone text-chibi-ink text-lg flex items-center justify-center transition-colors duration-200 hover:bg-white">
            {fav ? <IoHeart className="text-red-600" /> : <IoMdHeartEmpty />}
          </span>
        </button>

        <div className="aspect-[4/5] bg-white">
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
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-chibi-sand">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 sm:gap-2.5 p-3 sm:p-[18px] border-t border-[#e6e4d8]">
        <h3 className="text-[13px] sm:text-[15px] font-medium text-[#1b1c17] line-clamp-2">{nombre}</h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="flex min-w-0 flex-col-reverse gap-1 text-chibi-ink">
            <span className="chibi-display leading-none text-2xl sm:text-3xl">
              {displayPrice.current?.toLocaleString('es-ES')} XAF
            </span>
            {displayPrice.original && (
              <s className="text-xs sm:text-sm text-[#5b5d50]">
                {displayPrice.original?.toLocaleString('es-ES')} XAF
              </s>
            )}
          </p>

          {isInCart ? (
            <button
              type="button"
              disabled
              aria-label={`${nombre}: en el carrito`}
              title="En carrito"
              className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full bg-chibi-green text-chibi-ink flex items-center justify-center cursor-not-allowed"
            >
              <BsCartCheck className="text-xl" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Añadir ${nombre} al carrito`}
              title="Añadir al carrito"
              className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full bg-chibi-ink text-white flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-chibi-olive active:scale-95"
            >
              <FaPlus className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
