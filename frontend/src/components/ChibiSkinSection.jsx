import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import chibiskin from '../assets/chibiskin.jpeg';
import noir from '../assets/noir.jpg';
import SectionHeading from './SectionHeading';

const points = [
  { title: 'El Poder de la Moringa', text: 'Un secreto ancestral para una piel nutrida y protegida.' },
  { title: 'Hidratación Profunda', text: 'Clave fundamental para mantener la elasticidad y luminosidad de tu piel.' },
  { title: 'Bienestar Consciente', text: 'Fomentamos rituales de cuidado personal que conectan mente y piel.' },
];

const ChibiSkinSection = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  return (
    <motion.section
      className="bg-chibi-bone text-chibi-ink pb-14 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      aria-label="Chibi Skin"
    >
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 flex flex-col-reverse md:grid md:grid-cols-2 gap-7 md:gap-16 lg:gap-20 md:items-center">
        {/* Texto */}
        <div className="px-5 sm:px-6 md:px-0 flex flex-col gap-5 md:gap-6">
          <motion.div variants={itemVariants}>
            <SectionHeading eyebrow="Chibi Skin" size="md">
              Tu piel radiante comienza aquí
            </SectionHeading>
          </motion.div>

          <motion.p className="text-[15px] md:text-base leading-7 text-[#3b3d33]" variants={itemVariants}>
            En Chibi Skin, creemos que una piel sana es el reflejo de un bienestar integral. Nos enfocamos en ingredientes naturales y rutinas conscientes para nutrir y revitalizar tu piel desde adentro hacia afuera.
          </motion.p>

          <motion.dl className="divide-y divide-chibi-rule border-y border-chibi-rule" variants={containerVariants}>
            {points.map((p) => (
              <motion.div key={p.title} className="flex flex-col gap-1 py-4" variants={itemVariants}>
                <dt className="text-[15px] md:text-base font-semibold">{p.title}</dt>
                <dd className="text-sm leading-relaxed text-[#4a4c41]">{p.text}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div variants={itemVariants}>
            <a href="/chibi-skin" className="chibi-btn chibi-btn-ink w-full sm:w-auto">
              Ver Más Sobre Chibi Skin
              <FaArrowRight className="text-sm" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Imágenes (enlazan a Chibi Skin, como antes) */}
        <motion.div className="grid grid-cols-5 gap-3 md:gap-4 items-end" variants={itemVariants}>
          <a href="/chibi-skin" aria-label="Explorar Chibi Skin" className="group col-span-5 md:col-span-3 block overflow-hidden">
            <img
              src={chibiskin}
              alt="Imagen de cuidado de la piel"
              loading="lazy"
              className="w-full h-[380px] md:h-[640px] object-cover motion-reduce:transition-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </a>
          <img
            src={noir}
            alt="Producto Chibi en la tienda"
            loading="lazy"
            className="hidden md:block col-span-2 w-full h-[380px] object-cover"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ChibiSkinSection;
