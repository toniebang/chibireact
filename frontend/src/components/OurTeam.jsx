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

        <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((miembro) => (
            <motion.div
              key={miembro.id}
              className="single-item bg-white shadow-sm relative overflow-hidden group"
              variants={cardVariants}
            >
              <div className="img-holder relative h-80 w-full overflow-hidden">
                <img
                  src={miembro.foto}
                  alt={miembro.nombre}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="overlay-content absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-4
                             flex flex-col justify-end transform translate-y-full group-hover:translate-y-0
                             transition-transform duration-300 ease-out"
                >
                  <ul className="text-sm mb-4 space-y-2">
                    <li className="flex items-center">
                      <FaEnvelope className="mr-2 text-chibi-green" />{miembro.email}
                    </li>
                    <li className="flex items-center">
                      <FaPhoneAlt className="mr-2 text-chibi-green" />{miembro.telefono}
                    </li>
                  </ul>
                  <div className="overlay-buttom">
                    <div className="trainer-name mb-2">
                      <div className="name">
                        <h3 className="text-2xl font-bold leading-tight">{miembro.nombre}</h3>
                        <span className="text-chibi-green text-lg font-semibold">{miembro.departamento}</span>
                      </div>
                    </div>
                    {/* Esta es la descripción completa que aparece solo en el overlay */}
                    <p className="text-sm  leading-relaxed mb-4 opacity-90">{miembro.descripcion}</p>
                    <div className="social-links flex space-x-3 justify-center">
                      {miembro.linkedin && (
                        <a
                          href={miembro.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center bg-chibi-green hover:bg-black transition-colors duration-200"
                        >
                          <FaLinkedinIn className="text-white text-lg" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="content p-4 text-center">
                <div className="trainer-name mb-2">
                  <h3 className="text-xl font-bold">{miembro.nombre}</h3>
                  <span className="text-chibi-green text-sm">{miembro.departamento}</span>
                </div>
                {/* AÑADIDO: Descripción corta visible a primera vista */}
                
               
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default OurTeam;