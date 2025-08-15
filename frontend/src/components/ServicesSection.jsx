// src/components/ServicesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

import offerProducts1 from '../assets/offer-products-1.jpg';
import offerProducts22 from '../assets/offer-products-2.jpg';
import offerProducts3 from '../assets/offer-products-3.jpg';
import offerProducts4 from '../assets/offer-products-4.jpg';

import tile from '../assets/bg-2.png';

const services = [
  { id: 'entrenamiento', title: 'Entrenamiento al aire libre', image: offerProducts1, alt: 'Entrenamiento al aire libre' },
  { id: 'dietas',        title: 'Dietas Personalizadas',       image: offerProducts22, alt: 'Dietas personalizadas' },
  { id: 'tes',           title: 'Tés 100% naturales',          image: offerProducts3,  alt: 'Tés 100% naturales' },
  { id: 'skincare',      title: 'Productos Skin Care',         image: offerProducts4,  alt: 'Productos de skin care' },
];

const container = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.08 } },
};

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const headingL = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const headingR = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ServicesSection = () => {
  return (
    <motion.section
      className="shop-cta py-14 md:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header moderno */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <motion.div variants={headingL} className="flex items-center gap-3">
            <span className="inline-block px-2.5 py-1 text-[11px] tracking-widest bg-black text-white">
              CHIBI
            </span>
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
            <motion.a
              key={s.id}
              href="#"
              role="button"
              aria-label={s.title}
              data-toggle="modal"
              data-target={`#${s.id}`}
              variants={item}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className={[
                // wrapper con borde degradado sutil
                "group relative block p-[1px] rounded-2xl",
                "bg-gradient-to-br from-gray-200 via-gray-100 to-white",
                "shadow-sm hover:shadow-md transition-shadow duration-300"
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

                  {/* overlay glass + gradient abajo para el título */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end">
                    <div className="backdrop-blur-[2px] bg-white/5 px-3 py-2 rounded-md border border-white/10">
                      <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  {/* “shine” sutil en hover */}
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
            </motion.a>
          ))}

        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
