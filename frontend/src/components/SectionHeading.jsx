// src/components/SectionHeading.jsx
// Encabezado de sección compartido: etiqueta pequeña + titular condensado.
// Solo presentación, sin lógica.
import React from 'react';

const SectionHeading = ({
  eyebrow,
  children,
  as: Tag = 'h2',
  tone = 'dark',   // 'dark' = texto oscuro sobre fondo claro | 'light' = texto claro sobre fondo oscuro
  size = 'lg',     // 'lg' secciones principales | 'md' bloques a dos columnas
  className = '',
}) => {
  const sizes =
    size === 'md'
      ? 'text-[2.75rem] sm:text-6xl lg:text-[clamp(3.5rem,5.6vw,5rem)]'
      : 'text-[3.25rem] sm:text-7xl lg:text-[clamp(4.5rem,6.4vw,5.75rem)]';

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {eyebrow && (
        <p className={`chibi-eyebrow ${tone === 'light' ? 'text-chibi-green' : 'text-chibi-olive'}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`chibi-display text-balance ${sizes} ${tone === 'light' ? 'text-white' : 'text-chibi-ink'}`}>
        {children}
      </Tag>
    </div>
  );
};

export default SectionHeading;
