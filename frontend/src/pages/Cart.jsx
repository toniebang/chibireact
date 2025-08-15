// src/pages/Cart.jsx
import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  IoTrashOutline,
  IoRemoveOutline,
  IoAddOutline,
  IoCartOutline,
  IoPricetagOutline,
} from 'react-icons/io5';

const WHATSAPP_PHONE = '240555766714'; // actualiza si hace falta

const formatPrice = (v) => {
  const num = Number(v);
  if (!Number.isFinite(num)) return '0 XAF';
  return `${num.toLocaleString('es-ES')} XAF`;
};

const splitChips = (raw) =>
  (raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const safeQty = (it) => Number(it.quantity ?? it.qty ?? 1) || 1;
const getPid = (it) => it.product_id ?? it.product?.id ?? it.id;

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // 👈 para exigir login
  const {
    cart,
    loading,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useCart();

  const items = cart?.items || cart?.line_items || [];
  const [pending, setPending] = useState({});
  const [clearing, setClearing] = useState(false);

  const getUnitPrice = (it) => {
    const p = it.product || it;
    if (!p) return 0;
    const precio = Number(p.precio) || 0;
    const oferta = Boolean(p.oferta);
    const rebaja = Number(p.precio_rebaja) || 0;
    return oferta && rebaja > 0 ? rebaja : precio;
  };

  const getMaxStock = (it) => {
    const p = it.product || it;
    const stockVal = p?.stock;
    if (typeof stockVal === 'number' && Number.isFinite(stockVal)) return stockVal;
    return Infinity;
  };

  const totals = useMemo(() => {
    const serverTotal = Number(cart?.total_price);
    if (Number.isFinite(serverTotal)) {
      return { subtotal: serverTotal, total: serverTotal };
    }
    const subtotal = items.reduce((acc, it) => {
      const qty = safeQty(it);
      return acc + getUnitPrice(it) * qty;
    }, 0);
    return { subtotal, total: subtotal };
  }, [cart, items]);

  const withPending = async (pid, fn) => {
    setPending((s) => ({ ...s, [pid]: true }));
    try { await fn(); }
    finally {
      setPending((s) => {
        const { [pid]: _omit, ...rest } = s;
        return rest;
      });
    }
  };

  const handleDec = async (e, it) => {
    e.preventDefault(); e.stopPropagation();
    const pid = getPid(it);
    const qty = safeQty(it);
    const next = Math.max(1, qty - 1);
    if (next === qty) return;
    await withPending(pid, () => updateCartItem(pid, next));
  };

  const handleInc = async (e, it) => {
    e.preventDefault(); e.stopPropagation();
    const pid = getPid(it);
    const qty = safeQty(it);
    const max = getMaxStock(it);
    const next = Math.min(max, qty + 1);
    if (next === qty) return;
    await withPending(pid, () => updateCartItem(pid, next));
  };

  const handleRemove = async (e, it) => {
    e.preventDefault(); e.stopPropagation();
    const pid = getPid(it);
    await withPending(pid, () => removeCartItem(pid));
  };

  const handleClear = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (items.length === 0) return;
    if (!window.confirm('¿Vaciar carrito por completo?')) return;
    try {
      setClearing(true);
      const ok = await clearCart(); // ahora robusto en el Context
      if (!ok) {
        alert('No se pudo vaciar el carrito en este momento.');
      }
    } finally {
      setClearing(false);
    }
  };

  // --- WhatsApp (exige login) ---
  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push('🛒 *Pedido Chibi Market*');
    lines.push('');
    items.forEach((it, idx) => {
      const p = it.product || it;
      const qty = safeQty(it);
      const unit = getUnitPrice(it);
      const line = unit * qty;
      const name = p?.nombre || `Producto ${idx + 1}`;
      lines.push(`• ${qty} × ${name}`);
      lines.push(`   ${formatPrice(unit)} c/u — Subtotal: ${formatPrice(line)}`);
    });
    lines.push('');
    lines.push(`Total: *${formatPrice(totals.total)}*`);
    // 🔕 Quitado el “indícame tu nombre…”
    return lines.join('\n');
  };

  const handleCheckout = (e) => {
    e.preventDefault(); e.stopPropagation();

    // 👇 Exigir autenticación con redirección de retorno
  if (!isAuthenticated) {
  addNotification('Debes iniciar sesión para poder solicitar tu pedido.', 'warning');
  const next = encodeURIComponent(location.pathname + location.search);
  navigate(`/auth?next=${next}`);
  return;
}

    const msg = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
const { addNotification } = useNotifications();
  const anyPending = loading || clearing || Object.keys(pending).length > 0;

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
                    const pid = getPid(it);
                    const qty = safeQty(it);
                    const name = p?.nombre || 'Producto';
                    const img = p?.imagen1 || p?.imagen2 || p?.imagen3 || '';
                    const unit = getUnitPrice(it);
                    const line = unit * qty;
                    const chips = splitChips(p?.lista_caracteristicas);
                    const isOffer = Boolean(p?.oferta) && Number(p?.precio_rebaja) > 0;
                    const original = Number(p?.precio) || 0;
                    const disabled = Boolean(pending[pid]) || loading;

                    return (
                      <div key={pid} className="p-3 sm:p-4 flex gap-3">
                        {/* Img */}
                        <Link
                          to={`/tienda/${pid}`}
                          className="w-20 h-20 flex-shrink-0 bg-gray-50 border border-gray-200 overflow-hidden"
                          title={name}
                        >
                          {img ? (
                            <img src={img} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={`/tienda/${pid}`}
                                className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 hover:underline"
                              >
                                {name}
                              </Link>
                              {isOffer && (
                                <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-white bg-chibi-green px-2 py-0.5 rounded-none">
                                  <IoPricetagOutline />
                                  Oferta
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleRemove(e, it)}
                              className="text-red-600 hover:text-red-700 p-1 rounded-none disabled:opacity-50"
                              title="Eliminar"
                              disabled={disabled}
                            >
                              <IoTrashOutline className="text-lg" />
                            </button>
                          </div>

                          {/* Chips */}
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

                          {/* Precio / Cantidad */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-semibold text-gray-900">
                                {formatPrice(unit)}
                              </span>
                              {isOffer && original > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(original)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center border border-gray-300">
                              <button
                                type="button"
                                onClick={(e) => handleDec(e, it)}
                                className="px-3 py-2 hover:bg-gray-100 rounded-none disabled:opacity-50"
                                disabled={disabled || qty <= 1}
                                aria-label="Disminuir"
                              >
                                <IoRemoveOutline />
                              </button>
                              <div className="px-4 py-2 text-sm select-none">{qty}</div>
                              <button
                                type="button"
                                onClick={(e) => handleInc(e, it)}
                                className="px-3 py-2 hover:bg-gray-100 rounded-none disabled:opacity-50"
                                disabled={disabled || qty >= getMaxStock(it)}
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
                    type="button"
                    onClick={handleClear}
                    className="px-5 py-3 bg-red-600 text-white hover:bg-red-700 rounded-none disabled:opacity-50"
                    disabled={anyPending || items.length === 0}
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
                  type="button"
                  onClick={handleCheckout}
                  className="mt-3 w-full px-5 py-3 bg-black text-white hover:bg-gray-800 rounded-none disabled:opacity-50"
                  disabled={anyPending || items.length === 0}
                >
                  Pedir ahora (WhatsApp)
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
