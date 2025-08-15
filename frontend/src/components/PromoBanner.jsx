// src/components/PromoBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/shopherobg.jpg"; // misma imagen del hero de la tienda
import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <motion.section
      className="relative w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Imagen de fondo */}
      <div className="relative h-64 md:h-80 rounded-none overflow-hidden">
        <img
          src={heroImg}
          alt="Fondo tienda Chibi"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
            Descubre la Tienda Online de Chibi
          </h2>
          <p className="mt-3 text-sm md:text-lg text-white/90 max-w-lg">
            Productos exclusivos, ofertas especiales y la mejor calidad, a un
            solo clic.
          </p>

          <Link
            to="/tienda"
            className="mt-5 inline-block bg-chibi-green hover:bg-black text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-colors duration-300"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default PromoBanner;
