import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import {
  IoTrashOutline,
  IoRemoveOutline,
  IoAddOutline,
  IoCartOutline
} from 'react-icons/io5';

const formatPrice = (v) => {
  if (typeof v !== 'number' || isNaN(v)) return '0 XAF';
  return `${v.toLocaleString('es-ES')} XAF`;
};

const splitChips = (raw) =>
  (raw || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useCart();

  const items = cart?.items || cart?.line_items || [];

  const getUnitPrice = (it) => {
    const p = it.product || it;
    if (!p) return 0;
    const precio = Number(p.precio) || 0;
    const offer = Boolean(p.oferta);
    const rebaja = Number(p.precio_rebaja) || 0;
    return offer && rebaja > 0 ? rebaja : precio;
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, it) => {
      const qty = Number(it.quantity || it.qty || 1);
      return acc + getUnitPrice(it) * qty;
    }, 0);
    return { subtotal, total: subtotal };
  }, [items]);

  const handleDec = async (it) => {
    const pid = it.product_id || it.product?.id || it.id;
    const qty = Number(it.quantity || it.qty || 1);
    const next = Math.max(1, qty - 1);
    await updateCartItem(pid, next);
  };

  const handleInc = async (it) => {
    const pid = it.product_id || it.product?.id || it.id;
    const qty = Number(it.quantity || it.qty || 1);
    await updateCartItem(pid, qty + 1);
  };

  const handleRemove = async (it) => {
    const pid = it.product_id || it.product?.id || it.id;
    await removeCartItem(pid);
  };

  const handleClear = async () => {
    if (items.length === 0) return;
    if (!window.confirm('¿Vaciar carrito por completo?')) return;
    await clearCart();
  };

  const handleCheckout = () => {
    navigate('/perfil?tab=pedidos');
  };

  return (
    <div className="font-montserrat">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-24 mb-16">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 flex items-center gap-2">
          <IoCartOutline className="text-xl" />
          Mi Carrito
        </h1>

        {loading ? (
          <div className="py-16 text-center text-gray-500">Cargando carrito…</div>
        ) : items.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
            <IoCartOutline className="text-5xl text-gray-300 mb-3" />
            <p className="text-gray-700 text-lg mb-4">Tu carrito está vacío.</p>
            <Link
              to="/tienda"
              className="px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista */}
              <div className="lg:col-span-2">
                <div className="divide-y border border-gray-200 bg-white">
                  {items.map((it) => {
                    const p = it.product || it;
                    const pid = it.product_id || p?.id || it.id;
                    const qty = Number(it.quantity || it.qty || 1);
                    const name = p?.nombre || 'Producto';
                    const img = p?.imagen1 || p?.imagen2 || p?.imagen3 || '';
                    const unit = getUnitPrice(it);
                    const line = unit * qty;
                    const chips = splitChips(p?.lista_caracteristicas);

                    return (
                      <div key={pid} className="p-3 sm:p-4 flex gap-3">
                        {/* Img */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 border border-gray-200 overflow-hidden">
                          {img ? (
                            <img src={img} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                              {name}
                            </h3>
                            <button
                              onClick={() => handleRemove(it)}
                              className="text-red-600 hover:text-red-700 p-1 rounded-none"
                              title="Eliminar"
                            >
                              <IoTrashOutline className="text-lg" />
                            </button>
                          </div>

                          {/* Chips de especificaciones */}
                          {chips.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {chips.map((c, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] border border-gray-300 px-2 py-0.5 rounded-none bg-white text-gray-700"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Precio, cantidad y subtotal */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-semibold text-gray-900">
                                {formatPrice(unit)}
                              </span>
                              {p?.oferta && p?.precio ? (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(Number(p.precio))}
                                </span>
                              ) : null}
                            </div>

                            {/* Controles cantidad */}
                            <div className="flex items-center border border-gray-300">
                              <button
                                onClick={() => handleDec(it)}
                                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 rounded-none"
                                disabled={qty <= 1}
                                aria-label="Disminuir"
                              >
                                <IoRemoveOutline />
                              </button>
                              <div className="px-4 py-2 text-sm">{qty}</div>
                              <button
                                onClick={() => handleInc(it)}
                                className="px-3 py-2 hover:bg-gray-100 rounded-none"
                                aria-label="Aumentar"
                              >
                                <IoAddOutline />
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-gray-700">
                            Subtotal: <span className="font-medium">{formatPrice(line)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Acciones lista */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to="/tienda"
                    className="px-5 py-3 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-none"
                  >
                    Seguir comprando
                  </Link>
                  <button
                    onClick={handleClear}
                    className="px-5 py-3 bg-red-600 text-white hover:bg-red-700 rounded-none"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>

              {/* Resumen */}
              <aside className="border border-gray-200 bg-white p-4 h-fit">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Resumen</h2>
                <div className="text-sm flex items-center justify-between py-2 border-b">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="text-base flex items-center justify-between py-3 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-3 w-full px-5 py-3 bg-black text-white hover:bg-gray-800 rounded-none"
                >
                  Pedir ahora
                </button>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
