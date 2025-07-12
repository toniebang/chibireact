// src/components/CartSection.jsx
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const CartSection = () => {
    const { cart, updateItemQuantity, removeItem, clearCart, fetchCart } = useCart();
    const { addNotification } = useNotifications();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // --- CAMBIO CLAVE AQUÍ ---
    // Verifica si 'cart' es nulo/indefinido O si 'cart.line_items' es nulo/indefinido O si su longitud es 0
    if (!cart || !cart.line_items || cart.line_items.length === 0) {
        return (
            <div className="p-6 bg-gray-700 rounded-lg shadow-inner text-center">
                <h3 className="text-2xl font-semibold mb-4 text-white">Tu Carrito está Vacío</h3>
                <p className="text-gray-300 mb-6">Parece que aún no has añadido ningún producto.</p>
                <Link
                    to="/tienda"
                    className="inline-block bg-chibi-green-light hover:bg-chibi-green text-black font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }
    // --- FIN DEL CAMBIO CLAVE ---

    const handleUpdateQuantity = async (lineItemId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(lineItemId);
            return;
        }
        try {
            await updateItemQuantity(lineItemId, newQuantity);
            addNotification('Cantidad actualizada en el carrito', 'success');
        } catch (error) {
            addNotification('Error al actualizar la cantidad', 'error');
            console.error('Error updating item quantity:', error);
        }
    };

    const handleRemoveItem = async (lineItemId) => {
        try {
            await removeItem(lineItemId);
            addNotification('Producto eliminado del carrito', 'success');
        } catch (error) {
            addNotification('Error al eliminar el producto', 'error');
            console.error('Error removing item from cart:', error);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            try {
                await clearCart();
                addNotification('Carrito vaciado con éxito', 'success');
            } catch (error) {
                addNotification('Error al vaciar el carrito', 'error');
                console.error('Error clearing cart:', error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-700 rounded-lg shadow-inner">
            <h3 className="text-2xl font-semibold mb-6 text-white text-center">Mi Carrito de Compras</h3>

            <div className="space-y-6">
                {cart.line_items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center bg-gray-800 p-4 rounded-lg shadow-md">
                        <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-md mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0"
                        />
                        <div className="flex-grow text-center sm:text-left">
                            <h4 className="text-lg font-bold text-chibi-green-light">{item.name}</h4>
                            <p className="text-gray-300">Precio unitario: <span className="font-semibold text-white">${item.price.toFixed(2)}</span></p>
                            <p className="text-gray-300">Subtotal: <span className="font-semibold text-white">${item.line_total.toFixed(2)}</span></p>
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                            <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md transition duration-200"
                                disabled={item.quantity <= 1}
                                aria-label="Disminuir cantidad"
                            >
                                -
                            </button>
                            <span className="text-lg font-bold text-white w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md transition duration-200"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md transition duration-200"
                                aria-label="Eliminar producto"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-600 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-xl font-bold text-chibi-green-light mb-4 sm:mb-0">
                    Total del Carrito: <span className="text-white">${cart.cart_total.toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={handleClearCart}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out"
                    >
                        Vaciar Carrito
                    </button>
                    <Link
                        to="/checkout"
                        className="inline-block text-center bg-chibi-green-light hover:bg-chibi-green text-black font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out"
                    >
                        Proceder al Pago
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartSection;