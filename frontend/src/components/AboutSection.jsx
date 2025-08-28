// src/components/AboutSection.jsx
import React from 'react';
import sectionBg from '../assets/perfect-plan-bg.png';

const AboutSection = () => {
  return (
    <section
      id="comenzar"
      className="relative py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
      aria-label="Sobre Chibi: plan perfecto"
    >
      {/* overlay suave para contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/10" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card a ancho de container con glassy look */}
        <div className="w-full bg-white/85 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-6 md:p-10 lg:p-12 text-center transition-transform duration-300 hover:translate-y-[1px]">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-black">
            SOMOS LA OPCIÓN PERFECTA PARA TU RENOVACIÓN
          </h2>

          {/* subrayado con identidad de marca */}
          <div className="mt-3 mb-6 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-chibi-green via-emerald-400 to-chibi-green" />

          <span className="block text-base md:text-lg mb-4 text-chibi-green">
            En Chibi te acompañamos de la mano hasta que puedas lograr tu objetivo.
          </span>

          <p className="text-sm md:text-base leading-relaxed md:leading-8 mb-6 text-gray-700 font-light">
            Te acompañamos con un enfoque 360°: dietas personalizadas, Chibi Tea para potenciar resultados,
            <span className="whitespace-pre"> </span>Chibi Sport para tu rendimiento y energía, rutinas de entrenamiento efectivas
            y Chibi Skin para una piel saludable — todo coordinado para tu bienestar.
          </p>

          <h4 className="text-3xl md:text-4xl font-extrabold text-black/15 mt-6 select-none tracking-tight">
            COMPROMETIDOS CON TU ÉXITO
          </h4>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
