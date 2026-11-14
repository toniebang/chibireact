// src/components/Hero.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/young-woman-training-gym-2.jpg';
import JoinModal from './JoinModal';

const ArrowRight = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const Hero = () => {
  const [openJoin, setOpenJoin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <section
        className="relative w-full min-h-[720px] md:min-h-[max(640px,min(880px,100svh))] flex flex-col text-white overflow-hidden bg-chibi-ink"
        aria-label="Chibi Fitness hero"
      >
        {/* Foto: a todo el ancho en móvil; a la derecha en escritorio para no tapar a la atleta */}
        <div className="absolute top-0 right-0 w-full h-[440px] md:h-full md:w-[62%]">
          <img
            src={heroImage}
            alt="Entrenamiento en el gym con el equipo Chibi"
            className={`absolute inset-0 w-full h-full object-cover object-[52%_20%] md:object-[40%_30%] transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
          />
          {/* Degradados para contraste */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'linear-gradient(0deg, #0b0c09 0%, rgba(11,12,9,0.55) 28%, rgba(11,12,9,0.1) 60%, rgba(11,12,9,0.5) 100%)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(90deg, #0b0c09 0%, rgba(11,12,9,0.72) 22%, rgba(11,12,9,0.05) 55%), linear-gradient(0deg, rgba(11,12,9,0.75) 0%, rgba(11,12,9,0) 30%)' }}
            aria-hidden="true"
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex-1 flex flex-col justify-end md:justify-between gap-8 md:gap-12 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-[300px] md:pt-36 pb-7 md:pb-11">
          <div className="flex flex-col gap-5 md:gap-7 max-w-3xl">
            <p className="chibi-eyebrow text-chibi-green flex items-center gap-3.5">
              <span className="inline-block h-[3px] w-9 md:w-12 bg-chibi-green" aria-hidden="true" />
              Chibi Feel Good · Malabo
            </p>

            <h1 className="chibi-display leading-[0.84] text-[clamp(3.25rem,17.6vw,4.75rem)] sm:text-[6.5rem] lg:text-[clamp(7rem,10.3vw,9.25rem)]">
              <span className="text-chibi-green">Transforma</span>
              <br />
              tu vida
              <br />
              con Chibi
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-[#e4e6da] max-w-md">
              Planes, productos y motivación para que alcances tus metas sin perder el ritmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5">
              <button type="button" onClick={() => setOpenJoin(true)} className="chibi-btn chibi-btn-white">
                Únete a Chibi
                <ArrowRight />
              </button>

              <Link to="/tienda" className="chibi-btn chibi-btn-ghost-white">
                Explorar tienda
              </Link>
            </div>
          </div>

          {/* Datos prácticos al pie de la portada */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-x-12 gap-y-2 border-t border-white/20 pt-5 text-[13px] leading-relaxed text-[#d5d8ca]">
            <span>
              <strong className="font-semibold text-white">Tienda física</strong> · Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon
            </span>
            <span>
              <strong className="font-semibold text-white">Horario</strong> · Lunes a Sábado, 8:00 – 17:00
            </span>
            <span>
              <strong className="font-semibold text-white">Teléfono</strong> · +240 555 308 250
            </span>
          </div>
        </div>
      </section>

      {openJoin && <JoinModal onClose={() => setOpenJoin(false)} />}
    </>
  );
};

export default Hero;
