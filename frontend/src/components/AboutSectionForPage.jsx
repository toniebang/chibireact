// src/components/AboutSectionForPage.jsx
import React from 'react';

const AboutSectionForPage = () => {
  return (
    <section
      id="comenzar"
      className="bg-chibi-ink text-white pt-28 md:pt-44 pb-14 md:pb-28"
      aria-label="Sobre Chibi"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-20 md:items-end">
        <div className="flex flex-col gap-5 md:gap-7">
          <p className="chibi-eyebrow text-chibi-green flex items-center gap-3.5">
            <span className="inline-block h-[3px] w-9 md:w-12 bg-chibi-green" aria-hidden="true" />
            Sobre Chibi
          </p>

          <h1 className="chibi-display leading-[0.84] text-[clamp(3.5rem,18vw,4.75rem)] sm:text-[6.5rem] lg:text-[clamp(6.5rem,9.6vw,9rem)]">
            Somos el <span className="text-chibi-green">Team Chibi</span>
          </h1>

          <p className="text-lg md:text-[22px] font-medium leading-snug max-w-md">
            Bienvenido a Chibi: una forma cercana y sencilla de cuidarte.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-[15px] md:text-base leading-7 text-chibi-mist">
          <p>
            Nacimos con una idea clara: hacer fácil lo saludable. Somos un equipo de personas que cree en
            los cambios reales, en los hábitos que se disfrutan y en el acompañamiento de verdad. En Chibi,
            cada paso se adapta a tu ritmo: te escuchamos, te guiamos y celebramos tus logros contigo.
          </p>

          <p>
            Creamos un universo que te cuida por dentro y por fuera: bienestar, movimiento y cuidado
            personal, con esa energía verde que nos identifica. No buscamos perfección, buscamos
            constancia. Porque cuando te sientes bien, todo fluye mejor.
          </p>

          <p className="border-t border-[#3a3d30] pt-4 text-white font-medium">
            Este es nuestro compromiso: hacerlo simple, hacerlo real, hacerlo contigo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionForPage;
