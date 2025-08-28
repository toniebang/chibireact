// src/components/AboutSectionForPage.jsx
import React from 'react';
import sectionBg from '../assets/perfect-plan-bg.png';

const AboutSectionForPage = () => {
  return (
    <section
      id="comenzar"
      className="relative py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
      aria-label="Sobre Chibi"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido centrado */}
        <div className="w-full text-center mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-4 text-black">
            SOMOS EL TEAM CHIBI
          </h2>

          <span className="block text-base md:text-lg mb-4 text-chibi-green">
            Bienvenido a Chibi: una forma cercana y sencilla de cuidarte.
          </span>

          <p className="text-sm md:text-base leading-relaxed mb-3 text-gray-700 font-light">
            Nacimos con una idea clara: hacer fácil lo saludable. Somos un equipo de personas que cree en
            los cambios reales, en los hábitos que se disfrutan y en el acompañamiento de verdad. En Chibi,
            cada paso se adapta a tu ritmo: te escuchamos, te guiamos y celebramos tus logros contigo.
          </p>

          <p className="text-sm md:text-base leading-relaxed mb-3 text-gray-700 font-light">
            Creamos un universo que te cuida por dentro y por fuera: bienestar, movimiento y cuidado
            personal, con esa energía verde que nos identifica. No buscamos perfección, buscamos
            constancia. Porque cuando te sientes bien, todo fluye mejor.
          </p>

          <p className="text-sm md:text-base leading-relaxed mb-6 text-gray-700 font-light">
            Este es nuestro compromiso: hacerlo simple, hacerlo real, hacerlo contigo.
          </p>

          <div className="border-b border-gray-700 w-24 mx-auto mb-4" />

          <h4 className="text-3xl md:text-3xl font-bold text-black/15 mt-6 select-none">
            COMPROMETIDOS CON TU ÉXITO
          </h4>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionForPage;
