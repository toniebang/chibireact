// src/components/CustomerFeedback.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa'; // Importamos FaQuoteLeft para el icono de comillas

// Importar Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Importar módulos necesarios de Swiper
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Importar los estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Puedes importar estilos adicionales si los necesitas, ej. 'swiper/css/effect-fade';

// Importa los datos de testimonios
import testimonials from '../data/testimonials';

const CustomerFeedback = () => {
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

  return (
    <motion.section
      id="feedbacks" // Añadimos el ID para navegación si es necesario
      className="faq-testimonial-section section-padding py-16 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-title text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800">
            <span className="border-b-4 border-chibi-green pb-1">Lo que dicen nuestros clientes</span>
          </h1>
        </div>

        <div className="testimonial-carousel-wrapper">
          <Swiper
            // Configuración de Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30} // Espacio entre slides
            slidesPerView={1} // Cuántas slides se ven a la vez
            loop={true} // Bucle infinito
            autoplay={{
              delay: 5000, // Retraso entre slides en ms
              disableOnInteraction: false, // No detener autoplay al interactuar
            }}
            pagination={{
              clickable: true, // Puntos de paginación clickeables
              dynamicBullets: true, // Puntos dinámicos para mayor estética
            }}
            navigation={false} // Flechas de navegación
            className="mySwiper" // Clase para CSS adicional si es necesario
            breakpoints={{
              // Cuando el ancho de la pantalla sea >= 768px (md)
              768: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              // Cuando el ancho de la pantalla sea >= 1024px (lg)
              1024: {
                slidesPerView: 3,
                spaceBetween: 50,
              },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="single-testimonial-carousel bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center h-full">
                  <div className="qoute-icon-box mb-4 text-chibi-green text-3xl">
                  
                    <FaQuoteLeft />
                 
                  </div>
                  <div className="testimonial-text-box flex-grow">
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">"{testimonial.quote}"</p>
                    <span className="name font-bold text-gray-800 text-l block mb-2">{testimonial.name}</span>
                    <div className="review-box flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerFeedback;