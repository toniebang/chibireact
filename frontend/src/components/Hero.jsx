// src/components/Hero.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/young-woman-training-gym-2.jpg';
import JoinModal from './JoinModal';

const Hero = () => {
  const [openJoin, setOpenJoin] = useState(false);

  return (
    <>
      <section
        className="relative w-full min-h-[60vh] md:min-h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-label="Chibi Fitness hero"
      >
        {/* Overlay para mejorar contraste del texto */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/30" aria-hidden="true" />

        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-4">
            <span className="text-chibi-green">Transforma</span> tu Vida con Chibi Fitness
          </h1>

          {/* Nota: md:text-m no existe en Tailwind → md:text-lg */}
          <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8">
            Entrenamientos personalizados, planes nutricionales, productos de cuidado y la motivación que necesitas para alcanzar tus metas.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
            {/* Abrir modal de unirse */}
            <button
              type="button"
              onClick={() => setOpenJoin(true)}
              className="inline-block bg-chibi-green text-white font-bold py-3 md:py-4 px-6 md:px-8 text-sm md:text-base rounded-full shadow-lg transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Unirse a Chibi Fitness"
            >
              ÚNETE A CHIBI FITNESS
            </button>

            {/* CTA secundaria: explorar productos */}
            <Link
              to="/tienda"
              className="inline-block text-white font-bold py-3 md:py-4 px-6 md:px-8 text-sm md:text-base rounded-full border border-white/80 hover:bg-white hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Explorar productos"
            >
              EXPLORAR PRODUCTOS
            </Link>
          </div>
        </div>
      </section>

      {openJoin && <JoinModal onClose={() => setOpenJoin(false)} />}
    </>
  );
};

export default Hero;
