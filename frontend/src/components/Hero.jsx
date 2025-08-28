// src/components/Hero.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/young-woman-training-gym-2.jpg';
import JoinModal from './JoinModal';

const Hero = () => {
  const [openJoin, setOpenJoin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <section
        className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
        aria-label="Chibi Fitness hero"
      >
        {/* Imagen principal: ahora es contenido real (mejor LCP) */}
        <img
          src={heroImage}
          alt="Entrenamiento en el gym con el equipo Chibi"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          decoding="async"
          fetchpriority="high"
          onLoad={() => setLoaded(true)}
        />

        {/* Placeholder simple mientras carga (sin cargar otra imagen) */}
        {!loaded && (
          <div className="absolute inset-0 bg-[#0b0b0b]" aria-hidden="true" />
        )}

        {/* Overlay para contraste */}
        <div
          className="absolute inset-0 bg-black/40 md:bg-black/30"
          aria-hidden="true"
        />

        {/* Contenido */}
        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-4">
            <span className="text-chibi-green">Transforma</span> tu vida con Chibi
          </h1>

          <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8">
Planes, productos y motivación para que alcances tus metas sin perder el ritmo.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
           <button
  type="button"
  onClick={() => setOpenJoin(true)}
  className="
    inline-flex items-center justify-center cursor-pointer
    h-11 md:h-12 px-6 md:px-8 rounded-full
    bg-chibi-green text-white font-semibold tracking-tight
    shadow-md md:shadow-lg transition-transform duration-150
    hover:opacity-95 active:scale-95
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-chibi-green focus-visible:ring-offset-2 focus-visible:ring-offset-black
    disabled:opacity-60 disabled:cursor-not-allowed
  "
>
  Únete a Chibi
</button>

<Link
  to="/tienda"
  className="
    inline-flex items-center justify-center
    h-11 md:h-12 px-6 md:px-8 rounded-full
    border border-white/80 text-white font-semibold tracking-tight
    transition-colors  duration-150
    hover:bg-white hover:text-black active:scale-95
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
  "
>
  Explorar tienda
</Link>

          </div>
        </div>
      </section>

      {openJoin && <JoinModal onClose={() => setOpenJoin(false)} />}
    </>
  );
};

export default Hero;
