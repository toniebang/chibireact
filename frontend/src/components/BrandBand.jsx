// src/components/BrandBand.jsx
// Franja verde con el lema y las líneas de Chibi. Decorativa: el contenido se
// duplica para el desplazamiento continuo y la copia se oculta a lectores de pantalla.
import React from 'react';

const items = ['Comprometidos con tu éxito', 'Chibi Sport', 'Chibi Tea', 'Chibi Skin', 'Dietas personalizadas'];

const Row = ({ hidden = false }) => (
  <div className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={hidden || undefined}>
    {items.map((t) => (
      <React.Fragment key={t}>
        <span>{t}</span>
        <span aria-hidden="true">/</span>
      </React.Fragment>
    ))}
  </div>
);

const BrandBand = () => (
  <div className="bg-chibi-green text-chibi-ink overflow-hidden">
    <div className="flex w-max items-center h-[52px] md:h-16 whitespace-nowrap chibi-display leading-none text-[22px] md:text-[26px] animate-slide-infinite">
      <Row />
      <Row hidden />
      <Row hidden />
      <Row hidden />
    </div>
  </div>
);

export default BrandBand;
