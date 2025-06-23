import React from 'react';
import { motion } from 'framer-motion'; // Importa motion

// Asegúrate de que las rutas a tus imágenes sean correctas
import offerProducts1 from '../assets/offer-products-1.jpg';
import offerProducts22 from '../assets/offer-products-2.jpg';
import offerProducts3 from '../assets/offer-products-3.jpg';
import offerProducts4 from '../assets/offer-products-4.jpg';

// Nueva importación de la imagen 'tile'
import tile from '../assets/bg-2.png';

const services = [
  {
    id: 'entrenamiento',
    title: 'Entrenamiento al aire libre',
    image: offerProducts1,
    alt: 'Imagen de entrenamiento al aire libre', // Mejorar el alt text
  },
  {
    id: 'dietas',
    title: 'Dietas Personalizadas',
    image: offerProducts22,
    alt: 'Imagen de dietas personalizadas', // Mejorar el alt text
  },
  {
    id: 'tes',
    title: 'Tés 100% naturales',
    image: offerProducts3,
    alt: 'Imagen de tés 100% naturales', // Mejorar el alt text
  },
  {
    id: 'skincare',
    title: 'Productos Skin Care',
    image: offerProducts4,
    alt: 'Imagen de productos Skin Care', // Mejorar el alt text
  },
];

const ServicesSection = () => {
  // Define las variantes para las animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Retraso entre la aparición de cada tarjeta de servicio
        delayChildren: 0.1 // Retraso inicial antes de que empiece la animación del primer hijo
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 }, // Inicia invisible y 50px hacia abajo
    visible: {
      opacity: 1,
      y: 0, // Se mueve a su posición final
      transition: {
        duration: 0.6, // Duración de la animación de cada ítem
        ease: "easeOut"
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, x: -50 }, // Animación para el título
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const tileVariants = {
    hidden: { opacity: 0, x: 50 }, // Animación para la imagen decorativa
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };


  return (
    <motion.section
      className="shop-cta py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Animar solo una vez cuando el 30% del componente esté visible
      variants={containerVariants} // Aplica las variantes del contenedor a la sección
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className='text-xl font-light'
            variants={headingVariants} // Aplica variantes al título
          >
            NUESTROS SERVICIOS
          </motion.h1>
          <motion.img
            src={tile}
            alt="Descripción de la imagen decorativa"
            variants={tileVariants} // Aplica variantes a la imagen decorativa
          />
        </div>

        <motion.div
          // ¡CLASES MODIFICADAS AQUÍ PARA 2 COLUMNAS EN MÓVIL!
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
          // No necesitamos 'initial'/'whileInView' aquí, ya que 'containerVariants' en la sección padre
          // se encarga de orquestar las animaciones de los hijos.
        >
          {services.map((service) => (
            <motion.a
              key={service.id}
              href="#"
              data-toggle="modal"
              data-target={`#${service.id}`}
              className="single-shop-cta block relative overflow-hidden shadow-lg group cursor-pointer
                                   transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
              variants={itemVariants} // Aplica las variantes de cada ítem aquí
            >
              <div className="img-holder-2 relative h-64">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 p-4
                                 bg-gradient-to-t from-black/100 to-transparent
                                 text-white flex items-end">
                  <h3 className="text-m font-semibold leading-tight">{service.title}</h3>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;