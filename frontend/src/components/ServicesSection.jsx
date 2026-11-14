// src/components/ServicesSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import SectionHeading from './SectionHeading';

import offerProducts1 from '../assets/trainer.jpg';
import offerProducts22 from '../assets/offer-products-2.jpg';
import offerProducts3 from '../assets/offer-products-3.jpg';
import offerProducts4 from '../assets/offer-products-4.jpg';

const services = [
  {
    id: 'entrenamiento',
    title: 'Entrenamiento con monitor',
    image: offerProducts1,
    alt: 'Entrenamiento con monitor',
    desc:
      'Sesiones dinámicas en gimnasio: fuerza funcional, HIIT y movilidad. Planes por niveles con seguimiento semanal.',
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
    title: 'Tés naturales',
    image: offerProducts3,
    alt: 'Tés naturales',
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

// Modal accesible + animado
const Modal = ({ open, onClose, title, image, alt, desc, bullets, ctaTo, ctaText }) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
            className="relative z-10 w-full max-w-3xl bg-white shadow-2xl overflow-hidden"
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
                    className="inline-flex items-center bg-chibi-ink text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-chibi-olive transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black/40"
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
      className="shop-cta bg-chibi-panel text-white py-14 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
      aria-label="Servicios de Chibi"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={headingL} className="px-5 sm:px-6 lg:px-8 mb-7 md:mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Chibi · Servicios" tone="light">Nuestros servicios</SectionHeading>
          <Link to="/packs" className="chibi-btn chibi-btn-ghost-white hidden md:inline-flex">
            Ver packs
          </Link>
        </motion.div>

        {/* Móvil: fila deslizable. Escritorio: 4 columnas escalonadas */}
        <motion.div className="flex gap-3.5 overflow-x-auto no-scrollbar touch-scroll snap-x px-5 sm:px-6 pb-2 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-6 lg:px-8 md:pb-0 md:items-start">
          {services.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => open(s.id)}
              variants={item}
              whileTap={{ scale: 0.98 }}
              aria-haspopup="dialog"
              aria-label={`Abrir información de ${s.title}`}
              className={[
                'group flex flex-col gap-3.5 md:gap-[18px] text-left cursor-pointer',
                'w-[258px] shrink-0 snap-start md:w-auto',
                i % 2 === 1 ? 'md:mt-14' : '',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-chibi-green focus-visible:ring-offset-4 focus-visible:ring-offset-chibi-panel',
              ].join(' ')}
            >
              <span className="relative block w-full h-[310px] md:h-[360px] overflow-hidden bg-[#1d2016]">
                <img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  className="w-full h-full object-cover motion-reduce:transition-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-2.5 md:left-4 md:top-3 chibi-display text-chibi-green text-[52px] md:text-[64px]" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>

              <h3 className="chibi-display text-[28px] md:text-[34px] text-white">{s.title}</h3>
              <span className="block text-sm leading-relaxed text-chibi-mist">{s.desc}</span>
              <span className="inline-flex items-center gap-2 min-h-11 text-xs md:text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 group-hover:text-chibi-green">
                Ver más
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
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
