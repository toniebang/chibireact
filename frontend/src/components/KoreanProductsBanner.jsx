// src/components/KoreanProductsBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import koreanBanner from "../assets/korean-products-banner.jpg";
import { Link } from "react-router-dom";

const KoreanProductsBanner = () => {
  return (
    <section className="bg-chibi-bone pb-14 md:pb-28" aria-label="Productos de Corea">
      <motion.div
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col-reverse md:flex-row bg-chibi-ink text-white md:min-h-[480px]">
          {/* Contenido */}
          <div className="md:w-1/2 flex flex-col justify-center gap-5 px-6 py-8 md:p-14">
            <p className="chibi-eyebrow text-chibi-green">Nuevo en Chibi</p>

            <h2 className="chibi-display text-[2.75rem] sm:text-6xl lg:text-[clamp(3.5rem,5.6vw,5rem)] text-balance">
              Productos de Corea <span className="text-chibi-green">Ahora Disponibles</span>
            </h2>

            <p className="text-[15px] md:text-base leading-7 text-[#d5d8ca] max-w-md">
              Descubre nuestra nueva colección de productos importados directamente de Corea.
              La mejor calidad en skincare y belleza.
            </p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#d5d8ca]">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-chibi-green" aria-hidden="true" />Importados originales</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-chibi-green" aria-hidden="true" />K-Beauty auténtico</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-chibi-green" aria-hidden="true" />Calidad premium</li>
            </ul>

            <div>
              <Link to="/tienda?korean=true" className="chibi-btn chibi-btn-white w-full sm:w-auto">
                <span>Explorar Productos Coreanos</span>
                <svg aria-hidden="true" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative md:w-1/2 h-56 md:h-auto">
            <img
              src={koreanBanner}
              alt="Productos coreanos de belleza"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[80%_center]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default KoreanProductsBanner;
