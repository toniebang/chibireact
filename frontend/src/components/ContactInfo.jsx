// src/components/ContactInfo.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Importa los iconos de Font Awesome que necesitas de react-icons/fa
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaRegClock } from 'react-icons/fa';
import SectionHeading from './SectionHeading';

// `id` permite enlazar a esta sección (p. ej. /sobre-chibi/#contact)
const ContactInfo = ({ id }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.15
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const row = "flex items-start gap-4 py-5 border-t border-chibi-line";
  const icon = "text-chibi-green text-lg mt-1 flex-shrink-0";

  return (
    <motion.section
      id={id}
      className="contact-section contact-page bg-chibi-ink text-white py-14 md:py-28 scroll-mt-16 md:scroll-mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      aria-label="Info de contacto"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-20 md:items-start">
        {/* Título */}
        <div className="flex flex-col gap-5 md:gap-6">
          <SectionHeading eyebrow="Malabo" tone="light" className="section-title">
            Info de Contacto
          </SectionHeading>
          <p className="text-lg md:text-[22px] font-medium leading-snug">Colaboración o pregunta?</p>
        </div>

        {/* Datos */}
        <ul className="contact-info-box border-b border-chibi-line text-[15px] md:text-base leading-relaxed text-[#e4e6da]">
          <motion.li variants={itemVariants} className={row}>
            <FaMapMarkerAlt className={icon} aria-hidden="true" />
            <div className="text-box">
              <p className="font-semibold text-white">Malabo</p>
              <p>Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon</p>
            </div>
          </motion.li>

          <motion.li variants={itemVariants} className={row}>
            <FaPhone className={icon} aria-hidden="true" />
            <div className="text-box">
              <p>Teléfono: +240 555 308 250</p>
            </div>
          </motion.li>

          <motion.li variants={itemVariants} className={row}>
            <FaEnvelope className={icon} aria-hidden="true" />
            <div className="text-box">
              <p className="break-all">chibifeelgood@hotmail.com</p>
            </div>
          </motion.li>

          <motion.li variants={itemVariants} className={row}>
            <FaRegClock className={icon} aria-hidden="true" />
            <div className="text-box flex-1 max-w-sm">
              <p className="flex justify-between gap-6">
                <span>Días semanales</span><span>09:00 – 18:00</span>
              </p>
              <p className="flex justify-between gap-6">
                <span>Sábado</span><span>10:00 – 14:00</span>
              </p>
              <p className="flex justify-between gap-6">
                <span>Domingo</span><span>Cerrado</span>
              </p>
            </div>
          </motion.li>
        </ul>
      </div>
    </motion.section>
  );
};

export default ContactInfo;
