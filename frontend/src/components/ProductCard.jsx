// src/components/ProductCard.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { BsCartCheck } from "react-icons/bs";

import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const ProductCard = ({ product }) => {
    const {
        id,
        imagen1,
        nombre,
        precio,
        oferta,
        precio_rebaja,
        is_new,
        disponible,
        stock,
        imagen2,
        imagen3,
        fecha_subida,
    } = product;

    const { cart, addToCart } = useCart();
    const { addNotification } = useNotifications();

    // --- MODIFIED LÓGICA: Comprobar si el producto está en el carrito ---
    const isInCart = useMemo(() => {
        // Ensure cart.line_items is an array before calling .some()
        // If cart is null/undefined, or cart.line_items is null/undefined, default to an empty array.
        
        const currentLineItems = cart?.items || []; // <--- CAMBIO AQUÍ: Ahora busca 'items'
        return currentLineItems.some(item => item.product_id === id);
    }, [cart, id]);
    // --- FIN MODIFIED LÓGICA ---

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

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!stock) {
            addNotification('Producto agotado', 'warning');
            return;
        }
        
        if (isInCart) {
            addNotification(`${nombre} ya está en el carrito`, 'info');
            return;
        }

        try {
            await addToCart(id, 1);
            addNotification(`${nombre} añadido al carrito`, 'success');
        } catch (error) {
            addNotification('Error al añadir al carrito', 'error');
            console.error('Error adding item to cart:', error);
        }
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        addNotification(`Función de favoritos para "${nombre}" (¡Próximamente!)`, 'info');
        console.log(`Toggle favorito para el producto ${id}`);
    };

    if (!disponible) {
        return null;
    }

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
                    <div className="new-product absolute top-3 left-3 bg-chibi-green text-white rounded-full text-[9px] font-semibold p-2 z-10">
                        <p>Nuevo</p>
                    </div>
                )}

                {oferta && (
                    <div className="offer-product absolute top-3 right-3 bg-red-600 text-white rounded-full text-[9px] font-semibold p-2 z-10">
                        <p>Rebajas</p>
                    </div>
                )}

                {!stock && (
                    <div className="absolute inset-0 flex items-center justify-start text-red-500 text-base font-bold px-2 py-2 z-20">
                        <p className='bg-amber-300 px-2'>Agotado</p>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 flex space-x-2 z-10 ">
                    {isInCart ? (
                        <button
                            className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center
                                     border border-green-600 cursor-not-allowed"
                            title="Producto añadido al carrito"
                            disabled
                        >
                            <BsCartCheck className="text-base" />
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className={`bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                                     border cursor-pointer border-gray-400 transition duration-300
                                     ${!stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                            title={stock ? "Añadir al carrito" : "Agotado"}
                            disabled={!stock}
                        >
                            <FaShoppingCart className="text-base" />
                        </button>
                    )}
                    
                    <button
                        onClick={handleToggleFavorite}
                        className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center
                                     cursor-pointer border border-gray-400 hover:bg-black hover:text-white transition duration-300"
                        title="Añadir a favoritos"
                    >
                        <IoHeart className="text-base" />
                    </button>
                </div>
            </div>

            <div className="title p-4 text-left flex-grow">
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
            {!oferta && <div className="h-[1.5rem]"></div>}

        </div>
    );
};

export default ProductCard;