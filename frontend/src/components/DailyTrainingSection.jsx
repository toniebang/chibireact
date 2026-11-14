import React from 'react';
import { FaCheck } from 'react-icons/fa';
import chibishop from '../assets/chibishop.jpg';
import SectionHeading from './SectionHeading';

// Sección de la tienda física en Malabo (el nombre del componente se mantiene por compatibilidad)
const DailyTrainingSection = () => {
  return (
    <section className="bg-chibi-ink text-white pb-16 md:py-28" aria-label="Tienda física en Malabo">
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 grid md:grid-cols-2 gap-7 md:gap-16 lg:gap-20 md:items-center">
        <img
          src={chibishop}
          alt="Fachada de Chibi Shop en Malabo"
          loading="lazy"
          className="w-full h-[280px] md:h-[520px] object-cover"
        />

        <div className="px-5 sm:px-6 md:px-0 flex flex-col gap-5 md:gap-6">
          <SectionHeading eyebrow="Malabo" tone="light" size="md">
            Visita nuestra tienda física
          </SectionHeading>

          <p className="text-[15px] md:text-base leading-7 text-[#d5d8ca]">
            Descubre toda la variedad de productos de Chibi Shop en persona. Nos puedes encontrar fácilmente en <span className="font-semibold text-white">Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon</span>
          </p>

          <ul className="text-sm md:text-[15px] text-[#e4e6da] divide-y divide-chibi-line border-y border-chibi-line">
            <li className="flex items-center gap-3.5 py-3.5">
              <FaCheck className="text-chibi-green shrink-0 text-xs" aria-hidden="true" />
              Amplia selección de skincare, deportes, tés y más
            </li>
            <li className="flex items-center gap-3.5 py-3.5">
              <FaCheck className="text-chibi-green shrink-0 text-xs" aria-hidden="true" />
              Asesoramiento personalizado de nuestros expertos
            </li>
            <li className="flex items-center gap-3.5 py-3.5">
              <FaCheck className="text-chibi-green shrink-0 text-xs" aria-hidden="true" />
              Un ambiente acogedor para tu bienestar integral
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DailyTrainingSection;
