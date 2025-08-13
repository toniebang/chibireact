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
              {/* Primer ítem: El Poder de la Moringa */}
              <motion.li className="flex items-start" variants={itemVariants}> {/* Cambiado items-center a items-start */}
                <FaLeaf className="text-chibi-green mr-3 text-xl flex-shrink-0" />
                {/* Contenedor que apila el título y la descripción en móvil, y los pone en fila en desktop */}
                <div className="flex flex-col md:flex-row md:items-center"> 
                  <span className="font-semibold md:mr-1 mb-1 md:mb-0">El Poder de la Moringa:</span>
                  <span className="text-sm md:text-base">Un secreto ancestral para una piel nutrida y protegida.</span>
                </div>
              </motion.li>
              {/* Segundo ítem: Hidratación Profunda */}
              <motion.li className="flex items-start" variants={itemVariants}> {/* Cambiado items-center a items-start */}
                <FaTint className="text-chibi-green mr-3 text-xl flex-shrink-0" />
                {/* Contenedor que apila el título y la descripción en móvil, y los pone en fila en desktop */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="font-semibold md:mr-1 mb-1 md:mb-0">Hidratación Profunda:</span>
                  <span className="text-sm md:text-base">Clave fundamental para mantener la elasticidad y luminosidad de tu piel.</span>
                </div>
              </motion.li>
              {/* Tercer ítem: Bienestar Consciente */}
              <motion.li className="flex items-start" variants={itemVariants}> {/* Cambiado items-center a items-start */}
                <FaSpa className="text-chibi-green mr-3 text-xl flex-shrink-0" />
                {/* Contenedor que apila el título y la descripción en móvil, y los pone en fila en desktop */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="font-semibold md:mr-1 mb-1 md:mb-0">Bienestar Consciente:</span>
                  <span className="text-sm md:text-base">Fomentamos rituales de cuidado personal que conectan mente y piel.</span>
                </div>
              </motion.li>
            </motion.ul>
            <motion.a
              href="/chibi-skin" 
              className="inline-flex items-center bg-chibi-green hover:bg-black text-white py-3 px-6 
                         hover:bg-chibi-green-dark transition-colors duration-300 text-base shadow-md"
              variants={itemVariants}
            >
              Ver Más Sobre Chibi Skin
              <FaArrowRight className="ml-2 text-lg" />
            </motion.a>
          </div>
          <motion.div
            className="md:w-1/2 h-full relative overflow-hidden rounded-lg shadow-lg group"
            variants={itemVariants}
          >
            <img 
              src={chibiskin} 
              alt="Imagen de cuidado de la piel" 
              className="w-full h-full object-cover"
            />
            {/* Image Overlay Button - Circular and Centered */}
            <a
              href="/tienda/chibi-skin" 
              className="absolute inset-0 flex items-center justify-center 
                         bg-opacity-40 opacity-70 group-hover:opacity-100 transition-opacity duration-300" 
            >
                <div className="bg-white text-black w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 text-center 
                                 transform scale-90 group-hover:scale-100 transition-transform duration-300
                                 hover:bg-chibi-green hover:text-white"
                >
                    <FaShoppingCart className="text-3xl" /> 
                    <span className="text-xs font-semibold mt-1 leading-none">Explorar </span> 
                </div>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ChibiSkinSection;