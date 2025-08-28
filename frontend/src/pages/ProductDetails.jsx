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
          <span className="absolute left-3 top-3 bg-chibi-green text-white text-xs px-2 py-1 rounded-none">Oferta</span>
        )}
        {product?.is_new && (
          <span className="absolute right-3 top-3 bg-black text-white text-xs px-2 py-1 rounded-none">Nuevo</span>
        )}
        <div className="w-full aspect-[4/4] flex items-center justify-center text-gray-400">Sin imagen</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {product?.oferta && (
        <span className="absolute left-3 top-3 z-10 bg-chibi-green text-white text-xs px-2 py-1 rounded-none">Oferta</span>
      )}
      {product?.is_new && (
        <span className="absolute right-3 top-3 z-10 bg-black text-white text-xs px-2 py-1 rounded-none">Nuevo</span>
      )}

      {/* Track swipeable (mobile) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar border border-gray-200 bg-gray-50 relative"
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
              className={`h-2.5 rounded-full transition-all ${i === slide ? 'w-6 bg-chibi-green' : 'w-2.5 bg-gray-300'}`}
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
              className={`border ${i === slide ? 'border-black' : 'border-gray-200'} p-0 overflow-hidden w-full aspect-square`}
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
          <span className="text-3xl font-semibold text-gray-900">
            {formatPrice(product.precio_rebaja)}
          </span>
          <span className="text-base text-gray-500 line-through">
            {formatPrice(product.precio)}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-gray-900">
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

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-24 font-montserrat">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/tienda" className="hover:underline">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          {product?.categoria?.[0] ? (
            <>
              <span className="text-gray-700">{product.categoria[0].nombre}</span>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-gray-700">{product?.nombre || '...'}</span>
        </nav>

        {/* Contenido principal */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">Cargando producto…</div>
        ) : err ? (
          <div className="py-16 text-center text-red-600">{err}</div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galería (swipe en mobile) */}
            <div>
              <GallerySwipe images={images} product={product} />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-3xl font-bold text-gray-900">{product.nombre}</h1>

              {/* Precio */}
              <div className="mt-4">{priceBlock}</div>

              {/* Descripción específica */}
              {product.descripcion && (
                <p className="mt-4 text-gray-700 text-base leading-relaxed">
                  <span className="font-bold">Descripción:</span>
                  <br />
                  {product.descripcion}
                </p>
              )}

              {/* Chips de categorías (no clicables) */}
              {categoryNames.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoryNames.map((nm, i) => (
                      <span
                        key={`${nm}-${i}`}
                        className="text-xs px-2 py-1 border border-gray-300 bg-white rounded-none"
                      >
                        {nm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado stock */}
              <div className="mt-2 text-sm">
                {product.stock ? (
                  <span className="text-green-700">En stock</span>
                ) : (
                  <span className="text-red-600">Agotado</span>
                )}
              </div>

              {/* Botones */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {isInCart ? (
                  <button
                    type="button"
                    aria-label="En el carrito"
                    className="flex items-center justify-center gap-2 px-5 py-3 text-white bg-black rounded-none cursor-default"
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
                    className="flex items-center justify-center gap-2 px-5 py-3 text-black bg-white hover:bg-gray-200 border-2 border-black cursor-pointer rounded-none disabled:opacity-60"
                  >
                    <FaShoppingCart />
                    Añadir al carrito
                  </button>
                )}

                <button
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                  aria-label="Pedir ahora"
                  className="flex items-center justify-center gap-2 px-5 py-3 text-white bg-black hover:bg-chibi-green rounded-none disabled:opacity-60 cursor-pointer"
                >
                  <FaBolt />
                  Pedir ahora
                </button>
              </div>

              {/* Especificaciones (chips) */}
              {chips.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-gray-900">Especificaciones</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chips.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs border border-gray-300 px-2 py-1 rounded-none bg-white"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="mt-6 text-xs text-gray-500">
                {lineaLabel && (
                  <div className="mb-1">
                    Línea de producto:{' '}
                    <span className="text-gray-700 font-medium">{lineaLabel}</span>
                  </div>
                )}
                {product.fecha_subida && (
                  <div>
                    Subido: {new Date(product.fecha_subida).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>

              {/* Descripción general */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Nuestros productos son cuidadosamente seleccionados y mantenidos
                para ofrecerte la mejor calidad y frescura. Cada artículo es
                revisado antes de llegar a tus manos, garantizando una
                experiencia única de compra.
              </p>
            </div>
          </div>
        ) : null}

      {/* Similares */}
<section className="my-16">
  <h2 className="text-xl font-light mb-6">Productos Similares</h2>
  {loadingSimilar ? (
    <div className="text-gray-500">Cargando…</div>
  ) : similar.length === 0 ? (
    <div className="text-gray-500">No hay productos similares.</div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {similar.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )}

  {/* CTA a la tienda */}
  <div className="mt-8 flex justify-center">
    <Link
      to="/tienda"
      className="inline-flex items-center bg-chibi-green text-white py-3 px-6 rounded-full
                 hover:bg-chibi-green-dark transition-colors duration-300 shadow-md"
    >
      Ver toda la tienda
    </Link>
  </div>
</section>

      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;
