import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // FaTimes ya no es necesario
import noir from '../assets/noir.jpg'; // Importa la imagen si es necesario  
import img from '../assets/chibishop2.jpg'; // Importa la imagen si es necesario
import marisa from '../assets/marisa-piel.jpeg';
import training from '../assets/training.jpg';
import pic from '../assets/pic.jpg'; // Importa la imagen si es necesario
import look from '../assets/photo.jpg'; // Importa la imagen si es necesario
import photo2 from '../assets/photo2.jpg'; // Importa la imagen si es necesario
import photo3 from '../assets/aestetic.jpg'; // Importa la imagen si es necesario
import SectionHeading from './SectionHeading';
// Datos de ejemplo para la galería
const galleryItems = [
  { id: 1, src: img, alt: 'Nuestra tienda' }, // Asegúrate de que la ruta sea correcta
  { id: 2, src: training, alt: 'Entrenamientos' },
  { id: 3, src: noir, alt: 'Productos' },
  { id: 4, src: marisa, alt: 'Transformación' },
  { id: 5, src: look, alt: 'Night session' },
  { id: 6, src: photo2, alt: '' },
  { id: 7, src: photo3, alt: '' },
];

const HorizontalGallery = () => {
  const galleryRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollArrows = () => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); 
    }
  };

  useEffect(() => {
    checkScrollArrows();
    const galleryElement = galleryRef.current;
    if (galleryElement) {
      galleryElement.addEventListener('scroll', checkScrollArrows);
      window.addEventListener('resize', checkScrollArrows);
    }
    return () => {
      if (galleryElement) {
        galleryElement.removeEventListener('scroll', checkScrollArrows);
        window.removeEventListener('resize', checkScrollArrows);
      }
    };
  }, []);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300; 
      if (direction === 'left') {
        galleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-14 md:py-24 bg-chibi-panel" aria-label="Galería de la comunidad">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <SectionHeading tone="light" className="mb-8 md:mb-12">Nuestra Comunidad</SectionHeading>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scrollGallery('left')}
              className="hidden lg:block absolute left-3 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 cursor-pointer
                         hover:bg-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-chibi-green"
              aria-label="Desplazar a la izquierda"
            >
              <FaChevronLeft className="text-gray-900 text-base" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scrollGallery('right')}
              className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 cursor-pointer
                         hover:bg-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-chibi-green"
              aria-label="Desplazar a la derecha"
            >
              <FaChevronRight className="text-gray-900 text-base" />
            </button>
          )}

          <div ref={galleryRef} className="overflow-x-auto whitespace-nowrap custom-scrollbar touch-scroll"> 
            <div className="inline-flex space-x-3 pr-4">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex-shrink-0 w-60 h-80 md:w-72 md:h-96 bg-chibi-line overflow-hidden relative"
                  // Se elimina el onClick para abrir el modal
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    loading="lazy"
                    className="w-full h-full object-cover motion-reduce:transition-none transition-transform duration-700 ease-out group-hover:scale-[1.04]" 
                  />
                  {item.alt && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/75 to-transparent text-white">
                      <p className="font-semibold text-sm whitespace-normal">{item.alt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalGallery;