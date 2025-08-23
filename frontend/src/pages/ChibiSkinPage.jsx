// src/pages/ChibiSkinPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import ProductList from '../components/ProductList';
import ProductSkeleton from '../components/ProductSkeleton';
import PaginationClassic from '../components/PaginationClassic';
import { Leaf, Droplets, Sparkles, ShieldCheck } from 'lucide-react';
import chibiskin1 from "../assets/chibiskin1.jpg";
import chibiskin2 from "../assets/chibiskin2.jpg";
import chibiskin3 from "../assets/chibiskin3.jpg";
import chibiskin4 from "../assets/chibiskin4.webp";

const PAGE_SIZE = 16;
const LINEA = 'skin'; // 👈 ahora filtramos por línea “skin”

// limpia params
const buildParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '' && v !== false && v !== null)
  );

const ChibiSkinPage = () => {
  const { authAxios } = useAuth();

  // Datos
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  // UI
  const [page, setPage] = useState(1);
  const [loadingProds, setLoadingProds] = useState(false);
  const [error, setError] = useState('');

  // --- Cargar productos por línea = chibi ---
  const fetchProducts = async (targetPage = 1) => {
    setLoadingProds(true);
    setError('');
    try {
      const params = buildParams({
        linea: LINEA,            // 👈 clave del cambio
        page: targetPage,
        page_size: PAGE_SIZE,
        ordering: '-fecha_subida',
      });

      // console.log('[Chibi] Fetch productos params =>', params);

      const res = await authAxios.get('/productos/', { params });
      const { results = [], count = 0, next = null, previous = null } = res.data || {};

      setProducts(results);
      setCount(count);
      setNextUrl(next);
      setPrevUrl(previous);
      setPage(targetPage);
      if (targetPage !== page) window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('[Chibi] Error cargando productos:', e);
      setError('No se pudieron cargar los productos.');
      setProducts([]);
      setCount(0);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      setLoadingProds(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)),
    [count]
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || loadingProds) return;
    fetchProducts(p);
  };

  // Galería
  const galleryImages = [chibiskin1, chibiskin2, chibiskin3, chibiskin4];

  return (
    <>
      <Header />

      {/* Hero MEDIANO */}
      <section className="mt-24 font-montserrat bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900">
              Bienvenido a <span className="text-chibi-green font-medium">Chibi Skin</span>
            </h1>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Rituales de cuidado diseñados para nutrir, equilibrar y resaltar tu piel.
              Ingredientes seleccionados y rutinas conscientes para una belleza que se siente.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#galeria"
                className="px-5 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition"
              >
                Ver galería
              </a>
              <a
                href="#productos"
                className="px-5 py-3 border border-gray-300 rounded-none hover:bg-gray-50 transition"
              >
                Ver productos
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-montserrat">
            <div className="border border-gray-200 p-4 bg-white">
              <Leaf className="w-6 h-6 text-chibi-green mb-2" />
              <h3 className="font-semibold text-gray-900">Ingredientes Naturales</h3>
              <p className="text-sm text-gray-600 mt-1">
                Fórmulas con activos de origen natural para cuidar sin agredir.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <Droplets className="w-6 h-6 text-chibi-green mb-2" />
              <h3 className="font-semibold text-gray-900">Hidratación Profunda</h3>
              <p className="text-sm text-gray-600 mt-1">
                Texturas ligeras que retienen la humedad y mejoran la elasticidad.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <Sparkles className="w-6 h-6 text-chibi-green mb-2" />
              <h3 className="font-semibold text-gray-900">Luminosidad</h3>
              <p className="text-sm text-gray-600 mt-1">
                Un boost de brillo saludable para un aspecto radiante.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <ShieldCheck className="w-6 h-6 text-chibi-green mb-2" />
              <h3 className="font-semibold text-gray-900">Cuidado Consciente</h3>
              <p className="text-sm text-gray-600 mt-1">
                Rutinas fáciles, sostenibles y pensadas para tu día a día.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galería (4 imágenes) */}
      <section id="galeria" className="max-w-7xl font-montserrat mx-auto px-4 md:px-6 py-10">
        <h2 className="text-2xl font-light text-gray-900 mb-6">Galería Chibi Skin</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className="relative border border-gray-200 overflow-hidden bg-gray-50"
              title={`Imagen ${i + 1}`}
            >
              <img
                src={src}
                alt={`Chibi Skin ${i + 1}`}
                className="w-full h-48 md:h-56 object-cover transform transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Productos */}
      <main id="productos" className="max-w-7xl font-montserrat mx-auto px-4 md:px-6 pb-12">
        <h2 className="text-2xl font-light mb-4">Línea Chibi Skin</h2>

        {error ? (
          <div className="text-red-600 py-8">{error}</div>
        ) : loadingProds ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-600 py-12">No hay productos en esta línea todavía.</div>
        ) : (
          <>
            <ProductList
              products={products}
              loading={false}
              error=""
              isHome={false}
              gridColumns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            />

            <div className="mt-8 flex items-center justify-between">
              <PaginationClassic
                page={page}
                totalPages={Math.max(1, Math.ceil((count || 0) / PAGE_SIZE))}
                hasPrev={Boolean(prevUrl)}
                hasNext={Boolean(nextUrl)}
                onPageChange={goToPage}
              />
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Página <span className="font-medium text-gray-800">{page}</span> de{' '}
                <span className="font-medium text-gray-800">
                  {Math.max(1, Math.ceil((count || 0) / PAGE_SIZE))}
                </span>
              </div>
            </div>
          </>
        )}

        <p className="mt-10 text-sm text-gray-600 leading-relaxed">
          Nuestros productos Chibi Skin son cuidadosamente seleccionados y preparados para
          ofrecerte la mejor calidad. Cada artículo se revisa antes de llegar a tus manos,
          garantizando una experiencia de bienestar única.
        </p>
      </main>

      <Footer />
    </>
  );
};

export default ChibiSkinPage;
