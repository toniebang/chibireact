// src/components/AboutSection.jsx
import React from 'react';
import planImg from '../assets/plan-img.png';
import sectionBg from '../assets/perfect-plan-bg.png';

const AboutSection = () => {
  return (
    <section
      id="comenzar"
      className="relative py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
      aria-label="Sobre Chibi: plan perfecto"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          
          {/* Columna de la Imagen */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={planImg}
                alt="Plan perfecto de Chibi Fitness"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Columna del Texto con fondo blanco */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-4 text-black">
              SOMOS LA OPCIÓN PERFECTA PARA TU RENOVACIÓN
            </h2>

            <span className="block text-base md:text-lg mb-4 text-chibi-green">
              En Chibi te acompañamos de la mano hasta que puedas lograr tu objetivo.
            </span>

            <p className="text-sm md:text-base leading-relaxed mb-6 text-gray-700 font-light">
              Diseñamos un plan alimenticio que se ajuste a tus necesidades, tenemos una amplia gama
              de tés para acompañar a cualquiera que sea tu objetivo y te ofrecemos opciones de
              entrenamiento para un resultado más óptimo.
            </p>

            <div className="border-b border-gray-300 w-24 mb-4"></div>

            <h4 className="text-3xl md:text-4xl font-bold text-black/15 mt-6 select-none">
              COMPROMETIDOS CON TU ÉXITO
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
