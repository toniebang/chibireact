// src/components/JoinOurTeamSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import training from '../assets/training.jpg';
import chibishop2 from '../assets/chibishop2.jpg';
import SectionHeading from './SectionHeading';

const benefits = [
  { title: 'Entrenos Compartidos', text: 'Disfruta de sesiones grupales, retos colaborativos y encuentra compañeros para cada entreno.' },
  { title: 'Apoyo y Motivación', text: 'Rodéate de una comunidad que te impulsa a superar tus límites y celebrar cada logro.' },
  { title: 'Actividades Exclusivas', text: 'Participa en eventos especiales, salidas al aire libre y experiencias únicas con tu grupo.' },
];

const JoinOurTeamSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="bg-chibi-ink text-white pb-16 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      aria-label="Comunidad"
    >
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 flex flex-col-reverse md:grid md:grid-cols-2 gap-7 md:gap-16 lg:gap-20 md:items-center">
        {/* Texto */}
        <div className="px-5 sm:px-6 md:px-0 flex flex-col gap-5 md:gap-6">
          <motion.div variants={itemVariants}>
            <SectionHeading eyebrow="Nuestra comunidad" tone="light" size="md">
              ¡Entrena, Conecta y Crece <span className="text-chibi-green">con Nuestra Comunidad!</span>
            </SectionHeading>
          </motion.div>

          <motion.p className="text-[15px] md:text-base leading-7 text-[#d5d8ca]" variants={itemVariants}>
            En Chibi Feel Good, creemos en el poder de la conexión y el <span className="font-semibold text-white">bienestar compartido</span>.
            Si buscas unirte a un grupo de personas apasionadas por el fitness, compartir entrenamientos,
            participar en actividades divertidas y motivarte mutuamente, ¡este es tu lugar!
            Descubre cómo vivir el fitness de una forma más <span className="font-semibold text-white">divertida y social</span>.
          </motion.p>

          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5" variants={containerVariants}>
            {benefits.map((b) => (
              <motion.div key={b.title} className="flex flex-col gap-1.5 border-t border-[#3a3d30] pt-3.5" variants={itemVariants}>
                <h3 className="text-sm font-semibold">{b.title}</h3>
                <p className="text-[13px] leading-relaxed text-chibi-mist">{b.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <a href="/sobre-chibi/#contact" className="chibi-btn chibi-btn-white w-full sm:w-auto">
              Nuestro Contacto
            </a>
          </motion.div>
        </div>

        {/* Imágenes */}
        <motion.div className="grid grid-cols-5 gap-3 md:gap-4 items-end" variants={itemVariants}>
          <img
            src={training}
            alt="Grupo de entrenamiento Chibi Sport"
            loading="lazy"
            className="col-span-5 w-full h-[260px] md:h-[400px] object-cover"
          />
          <img
            src={chibishop2}
            alt="Estantería de Chibi Sport en la tienda"
            loading="lazy"
            className="hidden md:block col-start-3 col-span-3 w-full h-[220px] object-cover object-[center_35%]"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default JoinOurTeamSection;
