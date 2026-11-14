// src/pages/ProductDetails.jsx
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';

/* -----------------------
   Subcomponente: Galería
------------------------*/
function GallerySwipe({ images = [], product }) {
  const [slide, setSlide] = useState(0);
  const trackRef = React.useRef(null);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== slide) setSlide(idx);
  };

  const scrollToIdx = (i) => {
    const el = trackRef.current;
    if (!el) return;
    setSlide(i);
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  if (images.length === 0) {
    return (
      <div className="relative bg-gray-50 border border-gray-200 overflow-hidden">
        {product?.oferta && (
          <span className="absolute left-3 top-3 bg-chibi-green text-chibi-ink text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5">Oferta</span>
        )}
        {product?.is_new && (
          <span className="absolute right-3 top-3 bg-chibi-ink text-white text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5">Nuevo</span>
        )}
        <div className="w-full aspect-[4/4] flex items-center justify-center text-gray-400">Sin imagen</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {product?.oferta && (
        <span className="absolute left-3 top-3 z-10 bg-chibi-green text-chibi-ink text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5">Oferta</span>
      )}
      {product?.is_new && (
        <span className="absolute right-3 top-3 z-10 bg-chibi-ink text-white text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5">Nuevo</span>
      )}

      {/* Track swipeable (mobile) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-white relative"
        style={{ scrollBehavior: 'smooth' }}
        aria-roledescription="carousel"
        aria-label="Galería del producto"
      >
        {images.map((src, i) => (
          <div key={i} className="snap-center shrink-0 w-full">
            <img
              src={src}
              alt={`${product?.nombre || 'Producto'} - imagen ${i + 1}`}
              className="w-full aspect-[4/4] object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Flechas (solo desktop) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollToIdx(Math.max(0, slide - 1))}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center
                       w-9 h-9 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow
                       text-gray-900"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollToIdx(Math.min(images.length - 1, slide + 1))}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center
                       w-9 h-9 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow
                       text-gray-900"
            aria-label="Siguiente"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIdx(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${i === slide ? 'w-6 bg-chibi-ink' : 'w-2.5 bg-chibi-rule'}`}
            />
          ))}
        </div>
      )}

      {/* Miniaturas (desktop) */}
      {images.length > 1 && (
        <div className="hidden md:grid mt-3 grid-cols-3 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollToIdx(i)}
              className={`bg-white border ${i === slide ? 'border-2 border-chibi-ink' : 'border-[#dddbcf]'} p-0 overflow-hidden w-full aspect-square cursor-pointer`}
              title={`Vista ${i + 1}`}
              type="button"
            >
              <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -----------------------
   Página de Detalle
------------------------*/
const formatPrice = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A XAF';
  return `${value.toLocaleString('es-ES')} XAF`;
};

const MAX_SIMILAR = 8;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useAuth();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const isInCart = useMemo(() => {
    const items = cart?.items || [];
    return items.some((it) => it.product_id === Number(id));
  }, [cart, id]);

  const lineaLabel = useMemo(() => {
    const raw = product?.linea ? String(product.linea).toLowerCase().trim() : '';
    if (!raw) return null;
    if (['skin', 'chibiskin', 'chibi skin'].includes(raw)) return 'Chibi Skin';
    if (['tea', 'chibitea', 'chibi tea'].includes(raw)) return 'Chibi Tea';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [product]);

  // Cargar producto
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await authAxios.get(`/productos/${id}/`);
        if (!alive) return;
        setProduct(res.data);
      } catch (e) {
        if (!alive) return;
        setErr('No se pudo cargar el producto.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [authAxios, id]);

  // Cargar "Productos similares" (por categorías – unión, sin duplicados, máx. 8)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!product) return;
      const catIds = (product.categoria || []).map((c) => c?.id).filter(Boolean);
      if (catIds.length === 0) {
        setSimilar([]);
        return;
      }

      setLoadingSimilar(true);
      try {
        // hacemos varias peticiones (una por categoría) y unimos resultados
        const requests = catIds.map((cid) =>
          authAxios.get('/productos/', { params: { categoria: cid, page_size: 12 } })
        );
        const results = await Promise.allSettled(requests);

        const merged = new Map();
        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            const list = r.value?.data?.results || [];
            list.forEach((p) => {
              if (p.id !== product.id && !merged.has(p.id)) {
                merged.set(p.id, p);
              }
            });
          }
        });

        const arr = Array.from(merged.values()).slice(0, MAX_SIMILAR);
        if (!alive) return;
        setSimilar(arr);
      } catch {
        if (!alive) return;
        setSimilar([]);
      } finally {
        if (alive) setLoadingSimilar(false);
      }
    })();

    return () => { alive = false; };
  }, [authAxios, product]);

  const handleAdd = async () => {
    if (!product?.stock) return;
    await addToCart(product.id, 1);
  };

  const handleBuyNow = async () => {
    if (!product?.stock) return;
    await addToCart(product.id, 1);
    navigate('/carrito/');
  };

  const chips = useMemo(() => {
    const raw = product?.lista_caracteristicas || '';
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }, [product]);

  const categoryNames = useMemo(
    () => (product?.categoria || []).map((c) => c?.nombre).filter(Boolean),
    [product]
  );

  const priceBlock = useMemo(() => {
    if (!product) return null;
    if (product.oferta && product.precio_rebaja > 0) {
      return (
        <div className="flex items-baseline gap-3">
          <span className="chibi-display leading-none text-[42px] md:text-[52px] text-chibi-ink">
            {formatPrice(product.precio_rebaja)}
          </span>
          <span className="text-base text-[#5b5d50] line-through">
            {formatPrice(product.precio)}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-3">
        <span className="chibi-display leading-none text-[42px] md:text-[52px] text-chibi-ink">
          {formatPrice(product.precio)}
        </span>
      </div>
    );
  }, [product]);

  const images = useMemo(
    () => [product?.imagen1, product?.imagen2, product?.imagen3].filter(Boolean),
    [product]
  );

  return (
    <>
      <Header />

      <main className="bg-chibi-bone text-chibi-ink font-montserrat pt-20 md:pt-28">
       <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 md:pb-24">
        {/* Breadcrumbs */}
        <nav aria-label="Ruta" className="text-[13px] text-[#4a4c41] mb-4 md:mb-7 flex flex-wrap items-center min-h-11">
          <Link to="/tienda" className="hover:underline">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          {product?.categoria?.[0] ? (
            <>
              <span>{product.categoria[0].nombre}</span>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-chibi-ink font-semibold">{product?.nombre || '...'}</span>
        </nav>

        {/* Contenido principal */}
        {loading ? (
          <div className="py-16 text-center text-[#4a4c41]">Cargando producto…</div>
        ) : err ? (
          <div className="py-16 text-center text-red-600">{err}</div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[72px] items-start">
            {/* Galería (swipe en mobile) */}
            <div>
              <GallerySwipe images={images} product={product} />
            </div>

            {/* Info */}
            <div>
              {product.categoria?.[0]?.nombre && (
                <p className="chibi-eyebrow text-chibi-olive mb-4">{product.categoria[0].nombre}</p>
              )}
              <h1 className="chibi-display leading-[0.84] text-[clamp(3.25rem,16vw,4rem)] sm:text-7xl lg:text-[clamp(4rem,8vw,7.25rem)] text-chibi-ink break-words">{product.nombre}</h1>

              {/* Precio */}
              <div className="mt-5">{priceBlock}</div>

              {/* Descripción específica */}
              {product.descripcion && (
                <div className="mt-6 pt-5 border-t border-chibi-rule">
                  <h2 className="chibi-eyebrow text-chibi-ink mb-2.5">Descripción</h2>
                  <p className="text-[15px] leading-7 text-[#3b3d33]">{product.descripcion}</p>
                </div>
              )}

              {/* Chips de categorías (no clicables) */}
              {categoryNames.length > 0 && (
                <div className="mt-6 pt-5 border-t border-chibi-rule">
                  <h3 className="chibi-eyebrow text-chibi-ink mb-3">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoryNames.map((nm, i) => (
                      <span
                        key={`${nm}-${i}`}
                        className="text-[13px] px-3.5 py-2 border border-[#8b8d80] text-[#1b1c17]"
                      >
                        {nm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado stock */}
              <div className="mt-5 text-[13px] font-semibold">
                {product.stock ? (
                  <span className="inline-flex items-center gap-2 text-[#1b1c17]"><span className="h-2.5 w-2.5 bg-chibi-green" aria-hidden="true" />En stock</span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-700"><span className="h-2.5 w-2.5 bg-red-600" aria-hidden="true" />Agotado</span>
                )}
              </div>

              {/* Botones */}
              <div className="mt-5 flex flex-col-reverse sm:flex-row-reverse sm:justify-end gap-2.5 sm:gap-3">
                {isInCart ? (
                  <button
                    type="button"
                    aria-label="En el carrito"
                    className="chibi-btn bg-chibi-green text-chibi-ink h-14 px-8 cursor-default"
                    disabled
                  >
                    <BsCartCheck />
                    En el carrito
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={!product.stock}
                    aria-label="Añadir al carrito"
                    className="chibi-btn chibi-btn-ghost-ink h-14 px-8 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart />
                    Añadir al carrito
                  </button>
                )}

                <button
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                  aria-label="Pedir ahora"
                  className="chibi-btn chibi-btn-ink h-14 px-8 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaBolt />
                  Pedir ahora
                </button>
              </div>

              {/* Especificaciones (chips) */}
              {chips.length > 0 && (
                <div className="mt-6 pt-5 border-t border-chibi-rule">
                  <h3 className="chibi-eyebrow text-chibi-ink">Especificaciones</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chips.map((c, i) => (
                      <span
                        key={i}
                        className="text-[13px] border border-[#8b8d80] px-3.5 py-2 text-[#1b1c17]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="mt-6 pt-5 border-t border-chibi-rule text-xs text-[#4a4c41]">
                {lineaLabel && (
                  <div className="mb-1">
                    Línea de producto:{' '}
                    <span className="text-chibi-ink font-semibold">{lineaLabel}</span>
                  </div>
                )}
                {product.fecha_subida && (
                  <div>
                    Subido: {new Date(product.fecha_subida).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>

              {/* Descripción general */}
              <p className="mt-3 text-[13px] text-[#4a4c41] leading-relaxed">
                Nuestros productos son cuidadosamente seleccionados y mantenidos
                para ofrecerte la mejor calidad y frescura. Cada artículo es
                revisado antes de llegar a tus manos, garantizando una
                experiencia única de compra.
              </p>
            </div>
          </div>
        ) : null}

       </div>

      {/* Similares */}
<section className="bg-chibi-sand py-12 md:py-20" aria-label="Productos similares">
 <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
  <h2 className="chibi-display text-[2.875rem] sm:text-6xl lg:text-[clamp(3.5rem,5.6vw,5rem)] text-chibi-ink mb-6 md:mb-10">Productos Similares</h2>
  {loadingSimilar ? (
    <div className="text-gray-500">Cargando…</div>
  ) : similar.length === 0 ? (
    <div className="text-gray-500">No hay productos similares.</div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
      {similar.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )}

  {/* CTA a la tienda */}
  <div className="mt-8 md:mt-12 flex justify-center">
    <Link to="/tienda" className="chibi-btn chibi-btn-ghost-ink h-14 px-8 w-full sm:w-auto">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </svg>
      Volver a la tienda
    </Link>
  </div>
 </div>
</section>

      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;
