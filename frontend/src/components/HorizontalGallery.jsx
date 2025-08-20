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
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-light text-gray-900 text-center mb-8">
          Nuestra Comunidad
        </h2>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scrollGallery('left')}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-lg z-10
                         hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-chibi-green"
              aria-label="Desplazar a la izquierda"
            >
              <FaChevronLeft className="text-gray-700 text-xl" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scrollGallery('right')}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-lg z-10
                         hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-chibi-green"
              aria-label="Desplazar a la derecha"
            >
              <FaChevronRight className="text-gray-700 text-xl" />
            </button>
          )}

          <div ref={galleryRef} className="overflow-x-auto whitespace-nowrap pb-6 custom-scrollbar"> 
            <div className="inline-flex space-x-2 pr-4">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 w-64 h-80 bg-white shadow-md overflow-hidden relative cursor-pointer
                             transform transition-transform duration-300 hover:-translate-y-1"
                  // Se elimina el onClick para abrir el modal
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <p className="font-semibold text-sm">{item.alt}</p>
                  </div>
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