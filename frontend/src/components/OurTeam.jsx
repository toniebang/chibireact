// src/components/OurTeam.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Importa los iconos que vas a usar
import { FaEnvelope, FaPhoneAlt, FaLinkedinIn } from 'react-icons/fa';

// Importa los datos desde el nuevo archivo
import teamMembers from '../data/teamMembers';

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="experienced-trainer-area py-16 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-title text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800">
            <span className="border-b-4 border-chibi-green pb-1">Nuestro Equipo</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((miembro) => (
            <motion.div
              key={miembro.id}
              className="single-item bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              variants={cardVariants}
            >
              {/* Imagen del miembro */}
              <div className="img-holder relative h-85 w-full overflow-hidden">
                <img
                  src={miembro.foto}
                  alt={miembro.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información del miembro */}
              <div className="content p-6 flex flex-col flex-grow">
                {/* Nombre y departamento */}
                <div className="trainer-name mb-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-800">{miembro.nombre}</h3>
                  <span className="text-chibi-green text-lg font-semibold">{miembro.departamento}</span>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 text-center">
                  {miembro.descripcion}
                </p>

                {/* Contacto */}
                <ul className="text-sm mb-4 space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <FaEnvelope className="mr-2 text-chibi-green flex-shrink-0" />
                    <span className="break-all">{miembro.email}</span>
                  </li>
                  <li className="flex items-center">
                    <FaPhoneAlt className="mr-2 text-chibi-green flex-shrink-0" />
                    <span>{miembro.telefono}</span>
                  </li>
                </ul>

                {/* Social links */}
                {miembro.linkedin && (
                  <div className="social-links flex justify-center mt-auto pt-4">
                    <a
                      href={miembro.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-chibi-green hover:bg-black transition-colors duration-200 rounded-full"
                    >
                      <FaLinkedinIn className="text-white text-lg" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default OurTeam;