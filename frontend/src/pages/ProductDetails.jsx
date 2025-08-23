// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';
import ProductDetailsSkeleton from '../components/ProductDetailsSkeleton';

const formatPrice = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A XAF';
  return `${value.toLocaleString('es-ES')} XAF`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useAuth();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const isInCart = useMemo(() => {
    const items = cart?.items || [];
    return items.some((it) => it.product_id === Number(id));
  }, [cart, id]);

  // NEW: etiqueta amigable para la línea
  const lineaLabel = useMemo(() => {
    const raw = product?.linea ? String(product.linea).toLowerCase().trim() : '';
    if (!raw) return null;
    if (['skin', 'chibiskin', 'chibi skin'].includes(raw)) return 'Chibi Skin';
    if (['tea', 'chibitea', 'chibi tea'].includes(raw)) return 'Chibi Tea';
    // fallback: capitaliza
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [product]);

  // Carga producto
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await authAxios.get(`/productos/${id}/`);
        if (!alive) return;
        setProduct(res.data);
        const firstImg = res.data.imagen1 || res.data.imagen2 || res.data.imagen3 || '';
        setMainImg(firstImg);
      } catch (e) {
        if (!alive) return;
        setErr('No se pudo cargar el producto.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [authAxios, id]);

  // Carga relacionados (por línea; fallback a categoría)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!product) return;
      setLoadingRelated(true);
      try {
        let params = null;
        if (product.linea) {
          params = { linea: product.linea, page_size: 8 };
        } else if (product?.categoria?.[0]?.id) {
          params = { categoria: product.categoria[0].id, page_size: 8 };
        } else {
          setRelated([]);
          return;
        }

        const res = await authAxios.get('/productos/', { params });
        if (!alive) return;
        const list = (res.data?.results || []).filter((p) => p.id !== product.id);
        setRelated(list);
      } catch {
        if (!alive) return;
        setRelated([]);
      } finally {
        if (alive) setLoadingRelated(false);
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
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }, [product]);

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
              <Link
                to={`/tienda?categoria=${product.categoria[0].id}`}
                className="hover:underline"
              >
                {product.categoria[0].nombre}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-gray-700">{product?.nombre || "..."}</span>
        </nav>

        {/* Contenido principal */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Cargando producto…
          </div>
        ) : err ? (
          <div className="py-16 text-center text-red-600">{err}</div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galería */}
            <div>
              <div className="relative bg-gray-50 border border-gray-200 overflow-hidden">
                {product.oferta && (
                  <span className="absolute left-3 top-3 bg-chibi-green text-white text-xs px-2 py-1 rounded-none">
                    Oferta
                  </span>
                )}
                {product.is_new && (
                  <span className="absolute right-3 top-3 bg-black text-white text-xs px-2 py-1 rounded-none">
                    Nuevo
                  </span>
                )}
                {mainImg ? (
                  <img
                    src={mainImg}
                    alt={product.nombre}
                    className="w-full aspect-[4/4] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[4/4] flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[product.imagen1, product.imagen2, product.imagen3]
                  .filter(Boolean)
                  .map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(img)}
                      className={`border ${img === mainImg ? "border-black" : "border-gray-200"} p-0 overflow-hidden w-full aspect-square`}
                      title={`Imagen ${i + 1}`}
                    >
                      <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-3xl font-bold text-gray-900">
                {product.nombre}
              </h1>

              {/* Precio */}
              <div className="mt-4">{priceBlock}</div>

              {/* Descripción específica */}
              {product.descripcion && (
                <p className="mt-4 text-gray-700 text-base leading-relaxed">
                  <span className='font-bold'>Descripcion:</span><br />
                  {product.descripcion}
                </p>
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

              {/* Características (chips) */}
              {chips.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-gray-900">
                    Especificaciones
                  </h3>
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
                {/* NEW: línea de producto */}
                {lineaLabel && (
                  <div className="mb-1">
                    Línea de producto: <span className="text-gray-700 font-medium">{lineaLabel}</span>
                  </div>
                )}
                {product.fecha_subida && (
                  <div>
                    Subido: {new Date(product.fecha_subida).toLocaleDateString("es-ES")}
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

        {/* Relacionados */}
        <section className="mt-16">
          <h2 className="text-xl font-light mb-6">Productos Relacionados</h2>
          {loadingRelated ? (
            <div className="text-gray-500">Cargando…</div>
          ) : related.length === 0 ? (
            <div className="text-gray-500">No hay productos relacionados.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;
