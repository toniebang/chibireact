// src/components/KoreanProductsBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import koreanBanner from "../assets/korean-products-banner.jpg";
import { Link } from "react-router-dom";
import { IoSparklesOutline } from "react-icons/io5";

const KoreanProductsBanner = () => {
  return (
    <motion.section
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Contenedor principal */}
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Imagen de fondo */}
        <img
          src={koreanBanner}
          alt="Productos coreanos de belleza"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full w-fit mb-4"
          >
            <IoSparklesOutline className="text-xl" />
            <span className="text-sm font-medium">Nuevo en Chibi</span>
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Productos de Corea
            <br />
            <span className="text-chibi-green">Ahora Disponibles</span>
          </motion.h2>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-white/90 mb-6 max-w-xl"
          >
            Descubre nuestra nueva colección de productos importados directamente de Corea.
            La mejor calidad en skincare y belleza.
          </motion.p>

          {/* Botón */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="/tienda?korean=true"
              className="inline-flex items-center gap-2 bg-chibi-green hover:bg-white text-white hover:text-chibi-green font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Explorar Productos Coreanos</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-6 mt-8"
          >
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-chibi-green rounded-full" />
              <span className="text-sm">Importados originales</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-chibi-green rounded-full" />
              <span className="text-sm">K-Beauty auténtico</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-chibi-green rounded-full" />
              <span className="text-sm">Calidad premium</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default KoreanProductsBanner;
