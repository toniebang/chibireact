// src/components/PromoBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/shopherobg.jpg"; // misma imagen del hero de la tienda
import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <motion.section
      className="relative w-full mt-6 md:mt-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Imagen de fondo */}
      <div className="relative h-72 md:h-96 rounded-none overflow-hidden">
        <img
          src={heroImg}
          alt="Fondo tienda Chibi"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full text-left max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.1] text-white max-w-2xl text-balance">
            Descubre la Tienda Online de Chibi
          </h2>
          <p className="mt-4 text-sm md:text-lg font-light text-white/90 max-w-lg">
            Productos exclusivos, ofertas especiales y la mejor calidad, a un
            solo clic.
          </p>

          <Link
            to="/tienda"
            className="mt-6 inline-flex items-center justify-center h-12 bg-chibi-green hover:bg-white hover:text-black text-white font-semibold px-7 rounded-full shadow-lg transition-colors duration-300"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default PromoBanner;
