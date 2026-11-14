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
import SectionHeading from './SectionHeading';

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
      className="faq-testimonial-section section-padding py-14 md:py-24 bg-chibi-green text-chibi-ink"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="section-title mb-10 md:mb-12">
          <SectionHeading>Lo que dicen nuestros clientes</SectionHeading>
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
            className="mySwiper chibi-swiper" // estilos de marca en index.css
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
                <figure className="single-testimonial-carousel border-t-2 border-chibi-ink pt-5 flex flex-col text-left h-full">
                  <div className="qoute-icon-box mb-4 text-chibi-ink text-xl" aria-hidden="true">
                  
                    <FaQuoteLeft />
                 
                  </div>
                  <div className="testimonial-text-box flex-grow flex flex-col">
                    <blockquote className="text-chibi-ink text-[17px] md:text-[19px] font-medium leading-normal mb-6 flex-grow">"{testimonial.quote}"</blockquote>
                    <figcaption className="name chibi-display text-chibi-ink text-2xl md:text-[26px] block mb-2">{testimonial.name}</figcaption>
                    <div className="review-box flex gap-0.5" role="img" aria-label={`${testimonial.rating} de 5 estrellas`}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${i < testimonial.rating ? 'text-chibi-ink' : 'text-chibi-ink/25'}`}
                        />
                      ))}
                    </div>
                  </div>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerFeedback;