import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaTint, FaSpa, FaArrowRight, FaShoppingCart } from 'react-icons/fa'; 
import chibiskin from '../assets/chibiskin.jpeg'; 

const ChibiSkinSection = () => {
  const itemVariants = {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.section 
      className="py-16 bg-white text-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-stretch md:justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <motion.h2 
              className="text-5xl font-light text-gray-900 mb-4"
              variants={itemVariants} 
            >
              Descubre <span className="text-chibi-green font-medium">Chibi Skin</span>: Tu Piel Radiante Comienza Aquí
            </motion.h2>
            <motion.p 
              className="text-md mb-5 px-4"
              variants={itemVariants}
            >
              En Chibi Skin, creemos que una piel sana es el reflejo de un bienestar integral. Nos enfocamos en ingredientes naturales y rutinas conscientes para nutrir y revitalizar tu piel desde adentro hacia afuera.
            </motion.p>
            <motion.ul 
              className="list-none space-y-3 mb-6"
              variants={containerVariants} 
            >
              <motion.li className="flex items-center" variants={itemVariants}>
                <FaLeaf className="text-chibi-green mr-3 text-xl" />
                <span className="font-semibold">El Poder de la Moringa:</span> Un secreto ancestral para una piel nutrida y protegida.
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <FaTint className="text-chibi-green mr-3 text-xl" />
                <span className="font-semibold">Hidratación Profunda:</span> Clave fundamental para mantener la elasticidad y luminosidad de tu piel.
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <FaSpa className="text-chibi-green mr-3 text-xl" />
                <span className="font-semibold">Bienestar Consciente:</span> Fomentamos rituales de cuidado personal que conectan mente y piel.
              </motion.li>
            </motion.ul>
            <motion.a
              href="/chibi-skin" 
              className="inline-flex items-center bg-chibi-green text-white  py-3 px-6 
                         hover:bg-chibi-green-dark transition-colors duration-300 text-base shadow-md"
              variants={itemVariants}
            >
              Ver Más Sobre Chibi Skin
              <FaArrowRight className="ml-2 text-lg" />
            </motion.a>
          </div>
          <motion.div
            className="md:w-1/2 h-full relative overflow-hidden rounded-lg shadow-lg group" // Added 'group' for hover effects
            variants={itemVariants}
          >
            <img 
              src={chibiskin} 
              alt="Imagen de cuidado de la piel" 
              className="w-full h-full object-cover"
            />
            {/* Image Overlay Button - Circular and Centered */}
            <a
              href="/tienda/chibi-skin" // Reemplaza con la URL real de tu tienda Chibi Skin
              className="absolute inset-0 flex items-center justify-center 
                          bg-opacity-40 opacity-70 group-hover:opacity-100 transition-opacity duration-300" // Overlay de fondo
            >
                <div className="bg-white text-black w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 text-center 
                                  transform scale-90 group-hover:scale-100 transition-transform duration-300
                                  hover:bg-chibi-green hover:text-white"
                >
                    <FaShoppingCart className="text-3xl" /> {/* Icono más grande */}
                    <span className="text-xs font-semibold mt-1 leading-none">Explorar </span> {/* Texto más pequeño */}
                </div>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ChibiSkinSection;