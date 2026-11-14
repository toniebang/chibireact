// src/components/OurTeam.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Importa los iconos que vas a usar
import { FaEnvelope, FaPhoneAlt, FaLinkedinIn } from 'react-icons/fa';

// Importa los datos desde el nuevo archivo
import teamMembers from '../data/teamMembers';
import SectionHeading from './SectionHeading';

const OurTeam = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="experienced-trainer-area bg-chibi-bone text-chibi-ink py-14 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      aria-label="Nuestro equipo"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Las personas detrás de Chibi" className="section-title mb-8 md:mb-14">
          Nuestro Equipo
        </SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-6">
          {teamMembers.map((miembro) => (
            <motion.article
              key={miembro.id}
              className="single-item flex flex-col"
              variants={cardVariants}
            >
              {/* Imagen del miembro */}
              <div className="img-holder relative w-full aspect-[4/5] overflow-hidden bg-chibi-sand">
                <img
                  src={miembro.foto}
                  alt={miembro.nombre}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Información del miembro */}
              <div className="content pt-5 flex flex-col flex-grow gap-3">
                {/* Nombre y departamento */}
                <div className="trainer-name flex flex-col gap-2">
                  <span className="chibi-eyebrow text-chibi-olive">{miembro.departamento}</span>
                  <h3 className="chibi-display text-[34px] md:text-4xl text-balance">{miembro.nombre}</h3>
                </div>

                {/* Descripción */}
                <p className="text-sm leading-relaxed text-[#3b3d33]">
                  {miembro.descripcion}
                </p>

                {/* Contacto */}
                <ul className="mt-auto text-sm text-[#1b1c17] divide-y divide-chibi-rule border-y border-chibi-rule">
                  <li className="flex items-center gap-3 py-3">
                    <FaEnvelope className="text-chibi-olive flex-shrink-0" aria-hidden="true" />
                    <span className="break-all">{miembro.email}</span>
                  </li>
                  <li className="flex items-center gap-3 py-3">
                    <FaPhoneAlt className="text-chibi-olive flex-shrink-0" aria-hidden="true" />
                    <span>{miembro.telefono}</span>
                  </li>
                </ul>

                {/* Social links */}
                {miembro.linkedin && (
                  <div className="social-links flex">
                    <a
                      href={miembro.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${miembro.nombre}`}
                      className="w-11 h-11 flex items-center justify-center bg-chibi-ink text-white hover:bg-chibi-olive transition-colors duration-200 rounded-full"
                    >
                      <FaLinkedinIn className="text-lg" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default OurTeam;
