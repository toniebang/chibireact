// src/components/ContactInfo.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Importa los iconos de Font Awesome que necesitas de react-icons/fa
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaRegClock } from 'react-icons/fa';

const ContactInfo = () => {
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

  const itemVariants = {
    // Mantendremos las animaciones de los items
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="contact-section contact-page py-16 bg-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de Título */}
        <div className="section-title text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800">
            <span className="border-b-4 border-chibi-green pb-1">Info de Contacto</span>
          </h1>
        </div>

        {/* CAJA DE INFORMACIÓN PRINCIPAL */}
        {/* max-w-5xl mx-auto: para que sea más ancho y centrado */}
        {/* p-8: padding amplio como en versiones anteriores */}
        {/* shadow-lg: sombra */}
        {/* NOTA: Eliminado 'rounded-xl' o 'rounded-lg' */}
        <div className="contact-info-box bg-white p-8 shadow-sm max-w-5xl mx-auto">
          <h2 className="text-3xl font-ligth text-gray-900 mb-8 text-center">Colaboración o pregunta?</h2> {/* Aumentado el mb para separar del contenido */}
          
          {/* CONTENEDOR INTERNO DIVIDIDO EN DOS COLUMNAS */}
          {/* grid-cols-1 en móviles, md:grid-cols-2 en pantallas medianas y grandes */}
          {/* gap-x-12: para un buen espacio horizontal entre las dos columnas de info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-12">
            {/* BLOQUE IZQUIERDO (Ubicación y Teléfono) */}
            <div>
              <ul className="space-y-6"> {/* Espacio vertical entre los ítems de cada bloque */}
                <motion.li variants={itemVariants} className="flex items-start">
                  <div className="icon-box text-chibi-green text-xl mr-4 flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="text-box text-gray-700 text-lg">
                    <p>Malabo</p>
                    <p>Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon</p>
                  </div>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <div className="icon-box text-chibi-green text-xl mr-4 flex-shrink-0">
                    <FaPhone />
                  </div>
                  <div className="text-box text-gray-700 text-lg">
                    <p>Teléfono: +240 555 308 250</p>
                  </div>
                </motion.li>
              </ul>
            </div>

            {/* BLOQUE DERECHO (Email y Horarios) */}
            <div>
              <ul className="space-y-6"> {/* Espacio vertical entre los ítems de cada bloque */}
                <motion.li variants={itemVariants} className="flex items-start">
                  <div className="icon-box text-chibi-green text-xl mr-4 flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="text-box text-gray-700 text-lg">
                    <p>chibifeelgood@hotmail.com</p>
                  </div>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <div className="icon-box text-chibi-green text-xl mr-4 flex-shrink-0">
                    <FaRegClock />
                  </div>
                  <div className="text-box text-gray-700 text-lg">
                    <p className="flex justify-between">
                        <span>Días semanales</span><span>: 09:00 – 18:00</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Sábado</span><span>: 10:00 – 14:00</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Domingo</span><span>: Cerrado</span>
                    </p>
                  </div>
                </motion.li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactInfo;