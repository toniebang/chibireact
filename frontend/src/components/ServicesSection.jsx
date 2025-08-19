// src/components/ServicesSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import offerProducts1 from '../assets/offer-products-1.jpg';
import offerProducts22 from '../assets/offer-products-2.jpg';
import offerProducts3 from '../assets/offer-products-3.jpg';
import offerProducts4 from '../assets/offer-products-4.jpg';
import tile from '../assets/bg-2.png';

const services = [
  {
    id: 'entrenamiento',
    title: 'Entrenamiento al aire libre',
    image: offerProducts1,
    alt: 'Entrenamiento al aire libre',
    desc:
      'Sesiones dinámicas en parques y espacios abiertos: fuerza funcional, HIIT y movilidad. Planes por niveles con seguimiento semanal.',
    bullets: [
      'Grupos reducidos o 1-a-1',
      'Material incluido (bandas, cuerdas, kettlebells)',
      'Calendario flexible',
    ],
    ctaTo: '/packs',
    ctaText: 'Ver planes de entrenamiento',
  },
  {
    id: 'dietas',
    title: 'Dietas Personalizadas',
    image: offerProducts22,
    alt: 'Dietas personalizadas',
    desc:
      'Plan alimenticio adaptado a tu objetivo (pérdida de grasa, recomposición, aumento de masa) con ajustes quincenales.',
    bullets: [
      'Evaluación inicial + recordatorio calórico',
      'Opciones por preferencias e intolerancias',
      'Chek-ins y ajustes incluidos',
    ],
    ctaTo: '/packs',
    ctaText: 'Ver planes de dieta',
  },
  {
    id: 'tes',
    title: 'Tés 100% naturales',
    image: offerProducts3,
    alt: 'Tés 100% naturales',
    desc:
      'Blend de tés funcionales Chibi: energía, digestión, descanso y depuración. Ingredientes naturales seleccionados.',
    bullets: [
      'Fórmulas específicas por objetivo',
      'Sin azúcares añadidos',
      'Recomendaciones de uso y timing',
    ],
    ctaTo: '/tienda/categoria/te',
    ctaText: 'Ver tés en la tienda',
  },
  {
    id: 'skincare',
    title: 'Productos Skin Care',
    image: offerProducts4,
    alt: 'Productos de skin care',
    desc:
      'Rutinas simples y efectivas con activos clave (moringa, niacinamida, ácido hialurónico) para piel luminosa y protegida.',
    bullets: [
      'Rutinas por tipo de piel',
      'Guía de aplicación paso a paso',
      'Packs ahorro',
    ],
    ctaTo: '/tienda/categoria/skincare',
    ctaText: 'Ver skincare en la tienda',
  },
];

const container = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const headingL = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const headingR = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Modal accesible + animado
const Modal = ({ open, onClose, title, image, alt, desc, bullets, ctaTo, ctaText }) => {
  // Bloquea scroll de body cuando open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC para cerrar
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Imagen */}
              <div className="relative h-48 md:h-full">
                <img
                  src={image}
                  alt={alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 bg-black/10" aria-hidden="true" />
              </div>

              {/* Contenido */}
              <div className="p-5 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/40"
                    aria-label="Cerrar"
                    type="button"
                    autoFocus
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-700">
                      <path
                        fill="currentColor"
                        d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-sm md:text-base text-gray-700 mt-2">{desc}</p>

                {bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                    {bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to={ctaTo}
                    className="inline-flex items-center bg-chibi-green text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black/40"
                  >
                    {ctaText}
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ServicesSection = () => {
  const [openId, setOpenId] = useState(null);
  const open = (id) => setOpenId(id);
  const close = () => setOpenId(null);

  const current = services.find((s) => s.id === openId);

  return (
    <motion.section
      className="shop-cta py-14 md:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
      aria-label="Servicios de Chibi"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header moderno */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <motion.div variants={headingL} className="flex items-center gap-3">
            <span className="inline-block px-2.5 py-1 text-[11px] tracking-widest bg-black text-white">CHIBI</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Nuestros servicios</h2>
          </motion.div>

          <motion.img
            src={tile}
            alt=""
            aria-hidden="true"
            className="h-10 opacity-70 hidden sm:block"
            variants={headingR}
          />
        </div>

        {/* Grid 2 cols mobile / 4 desktop */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {services.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => open(s.id)}
              variants={item}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              aria-haspopup="dialog"
              aria-label={`Abrir información de ${s.title}`}
              className={[
                'group relative block p-[1px] rounded-2xl',
                'bg-gradient-to-br from-gray-200 via-gray-100 to-white',
                'shadow-sm hover:shadow-md transition-shadow duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60',
              ].join(' ')}
            >
              {/* inner card */}
              <div className="relative rounded-2xl overflow-hidden bg-white">
                {/* imagen */}
                <div className="relative aspect-[4/5]">
                  <img
                    src={s.image}
                    alt={s.alt}
                    loading="lazy"
                    className="w-full h-full object-cover motion-reduce:transition-none transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end">
                    <div className="backdrop-blur-[2px] bg-white/5 px-3 py-2 rounded-md border border-white/10">
                      <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">{s.title}</h3>
                    </div>
                  </div>

                  {/* shine */}
                  <span
                    className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  >
                    <span className="absolute -top-1/4 -left-1/2 h-[200%] w-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  </span>
                </div>

                {/* footer pill + CTA sutil */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-3">
                  <span className="text-xs text-gray-600">Ver más</span>
                  <span className="text-xs px-2 py-1 border border-gray-200 rounded-full text-gray-700 group-hover:border-gray-300">
                    Abrir
                  </span>
                </div>
              </div>

              {/* focus ring accesible */}
              <span className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-focus-visible:ring-black/60 transition" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Modal actual */}
      <Modal
        open={!!current}
        onClose={close}
        title={current?.title}
        image={current?.image}
        alt={current?.alt}
        desc={current?.desc}
        bullets={current?.bullets}
        ctaTo={current?.ctaTo}
        ctaText={current?.ctaText}
      />
    </motion.section>
  );
};

export default ServicesSection;
