// src/components/JoinOurTeamSection.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Importa motion
import { FaUsers, FaHeartbeat, FaHandshake, FaArrowRight } from 'react-icons/fa';

const JoinOurTeamSection = () => {
  // Variantes para el contenedor principal de la sección
  const sectionContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Ligero retraso entre la aparición de los hijos directos (h2, p, div.grid, a)
        delayChildren: 0.1 // Retraso inicial antes de que comience la animación del primer hijo
      }
    }
  };

  // Variantes para el título y el párrafo
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Variantes para los ítems de beneficio (FaHeartbeat, FaHandshake, FaUsers)
  const benefitItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Variantes para el botón
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className="py-20 bg-gray-900 text-white text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Animar una vez cuando el 30% del componente esté visible
      variants={sectionContainerVariants} // Aplica las variantes del contenedor principal
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
          variants={textVariants} // Animación para el título
        >
          ¡Entrena, Conecta y Crece <span className="text-chibi-green">con Nuestra Comunidad!</span>
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg mb-8 max-w-2xl mx-auto"
          variants={textVariants} // Animación para el párrafo
        >
          En Chibi Feel Good, creemos en el poder de la conexión y el <span className="font-semibold">bienestar compartido</span>.
          Si buscas unirte a un grupo de personas apasionadas por el fitness, compartir entrenamientos,
          participar en actividades divertidas y motivarte mutuamente, ¡este es tu lugar!
          Descubre cómo vivir el fitness de una forma más <span className="font-semibold">divertida y social</span>.
        </motion.p>

        {/* Beneficios de unirse a la comunidad - Ahora como motion.div para coordinar animaciones de hijos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-gray-300"
          variants={sectionContainerVariants} // Reutilizamos las variantes del contenedor para el staggerChildren
                                          // Esto permitirá que cada columna aparezca escalonadamente.
        >
          <motion.div className="flex flex-col items-center" variants={benefitItemVariants}>
            <FaHeartbeat className="text-chibi-green text-3xl mb-2" />
            <h4 className="font-semibold text-lg mb-1">Entrenos Compartidos</h4>
            <p className="text-sm leading-relaxed">
              Disfruta de sesiones grupales, retos colaborativos y encuentra compañeros para cada entreno.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={benefitItemVariants}>
            <FaHandshake className="text-chibi-green text-3xl mb-2" />
            <h4 className="font-semibold text-lg mb-1">Apoyo y Motivación</h4>
            <p className="text-sm leading-relaxed">
              Rodéate de una comunidad que te impulsa a superar tus límites y celebrar cada logro.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={benefitItemVariants}>
            <FaUsers className="text-chibi-green text-3xl mb-2" />
            <h4 className="font-semibold text-lg mb-1">Actividades Exclusivas</h4>
            <p className="text-sm leading-relaxed">
              Participa en eventos especiales, salidas al aire libre y experiencias únicas con tu grupo.
            </p>
          </motion.div>
        </motion.div>

        {/* Botón de Llamada a la Acción */}
        <motion.a
          href="/sobre-chibi/" // Enlace al contacto
          className="inline-flex items-center bg-chibi-green text-white py-2 px-6
                     hover:bg-white hover:text-black transition-colors duration-300 text-base shadow-lg
                     transform hover:scale-105 rounded-full"
          variants={buttonVariants} // Animación para el botón
        >
          Nuestro Contacto
          {/* <FaArrowRight className="ml-2 text-lg" /> */}
        </motion.a>
      </div>
    </motion.section>
  );
};

export default JoinOurTeamSection;