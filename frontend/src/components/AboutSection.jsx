// src/components/AboutSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import sectionBg from '../assets/perfect-plan-bg.png';
import chibiskin4 from '../assets/fit-individual-doing-sport.jpg';

const AboutSection = () => {
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(null);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    // Track breakpoint md+
    const mql = window.matchMedia('(min-width: 768px)');
    const updateBp = () => setIsMdUp(mql.matches);
    updateBp();
    mql.addEventListener('change', updateBp);
    return () => mql.removeEventListener('change', updateBp);
  }, []);

  useEffect(() => {
    if (!isMdUp || !textRef.current) {
      // En móvil, dejar alturas naturales
      setTextHeight(null);
      return;
    }

    // Observa la caja de texto y sincroniza su altura
    const el = textRef.current;
    const ro = new ResizeObserver(() => {
      setTextHeight(el.offsetHeight);
    });
    ro.observe(el);

    // Altura inicial
    setTextHeight(el.offsetHeight);

    // Recalcular también en resize de ventana (por cambios de ancho)
    const onResize = () => setTextHeight(el.offsetHeight);
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [isMdUp]);

  return (
    <section
      id="comenzar"
      className="relative py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
      aria-label="Sobre Chibi: plan perfecto"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:space-x-12">
          
          {/* Columna de la Imagen — su altura se ajusta a la del cuadro de texto en md+ */}
          <div
            className="w-full md:w-1/2 mb-8 md:mb-0"
            style={isMdUp && textHeight ? { height: textHeight } : undefined}
          >
            <div className="overflow-hidden rounded-lg shadow-lg w-full h-full">
              <img
                src={chibiskin4}
                alt="Plan perfecto de Chibi Fitness"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Columna del Texto con fondo blanco (altura natural; referencia para la imagen) */}
          <div className="w-full md:w-1/2">
            <div ref={textRef} className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-4 text-black">
                SOMOS LA OPCIÓN PERFECTA PARA TU RENOVACIÓN
              </h2>

              <span className="block text-base md:text-lg mb-4 text-chibi-green">
                En Chibi te acompañamos de la mano hasta que puedas lograr tu objetivo.
              </span>

              <p className="text-sm md:text-base leading-relaxed mb-6 text-gray-700 font-light">
                Te acompañamos con un enfoque 360°: dietas personalizadas, Chibi Tea para potenciar resultados,
                rutinas de entrenamiento efectivas y Chibi Skin para una piel saludable — todo coordinado para tu bienestar.
              </p>

              <div className="border-b border-gray-300 w-24 mb-4" />

              <h4 className="text-3xl md:text-4xl font-bold text-black/15 mt-6 select-none">
                COMPROMETIDOS CON TU ÉXITO
              </h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
