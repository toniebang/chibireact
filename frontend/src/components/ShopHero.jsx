import React from 'react';
import { Link } from 'react-router-dom';
// Si tienes una imagen local, impórtala:
// import heroImg from '../assets/tienda-hero.jpg';

const ShopHero = ({
  title = "Tienda Chibi",
  subtitle = "Descubre productos pensados para tu bienestar",
  ctaLabel = "Ver Novedades",
  ctaHref = "/tienda?ordering=-fecha_subida",
  // Si usas imagen remota: pásala por prop. Si es local, usa import arriba.
  bgImage = "https://images.unsplash.com/photo-1512203492609-8f7f07ff8bfa?q=80&w=2400&auto=format&fit=crop" // reemplaza por la tuya
}) => {
  return (
    <section className="relative font-montserrat mt-16 md:mt-12">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        aria-hidden="true"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      {/* Contenido */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="py-16 md:py-20 lg:py-24 text-white">
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            {title} <span className="text-chibi-green font-medium">•</span>
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg max-w-2xl">
            {subtitle}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to={ctaHref}
              className="inline-flex items-center px-6 py-3 bg-chibi-green text-white hover:bg-chibi-green-dark rounded-none"
            >
              {ctaLabel}
            </Link>
            <Link
              to="/packs"
              className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-none"
            >
              Ver Packs
            </Link>
          </div>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="h-1 bg-chibi-green" />
    </section>
  );
};

export default ShopHero;
