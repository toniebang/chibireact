// src/components/AboutSection.jsx
import React from 'react';
import SectionHeading from './SectionHeading';

// Los cinco pilares del enfoque 360°, tal como aparecen en el texto de la sección
const pillars = [
  { n: '01', title: 'Dietas personalizadas', text: 'Adaptadas a tu objetivo.' },
  { n: '02', title: 'Chibi Tea', text: 'Para potenciar resultados.' },
  { n: '03', title: 'Chibi Sport', text: 'Para tu rendimiento y energía.' },
  { n: '04', title: 'Rutinas de entrenamiento', text: 'Efectivas y con seguimiento.' },
  { n: '05', title: 'Chibi Skin', text: 'Para una piel saludable.' },
];

const AboutSection = () => {
  return (
    <section id="comenzar" className="bg-chibi-ink text-white py-16 md:py-28" aria-label="Sobre Chibi: plan perfecto">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col gap-10 md:gap-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-20 md:items-end">
          <SectionHeading eyebrow="Enfoque 360°" tone="light">
            Somos la opción perfecta para tu <span className="text-chibi-green">renovación</span>
          </SectionHeading>

          <div className="flex flex-col gap-4">
            <p className="text-lg md:text-[22px] font-medium leading-snug">
              En Chibi te acompañamos de la mano hasta que puedas lograr tu objetivo.
            </p>
            <p className="text-[15px] md:text-base leading-7 text-chibi-mist">
              Te acompañamos con un enfoque 360°: dietas personalizadas, Chibi Tea para potenciar resultados,
              <span className="whitespace-pre"> </span>Chibi Sport para tu rendimiento y energía, rutinas de entrenamiento efectivas
              y Chibi Skin para una piel saludable — todo coordinado para tu bienestar.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-5 md:gap-6 border-b border-[#3a3d30] md:border-b-0">
          {pillars.map((p) => (
            <li key={p.n} className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-2.5 border-t border-[#3a3d30] py-4 md:pt-4 md:pb-0">
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-chibi-green w-6 shrink-0">{p.n}</span>
              <span className="flex flex-col gap-1 md:gap-2.5">
                <span className="chibi-display text-[26px] md:text-3xl">{p.title}</span>
                <span className="text-[13px] md:text-sm leading-normal text-chibi-mist">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AboutSection;
