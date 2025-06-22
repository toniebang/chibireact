import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // FaTimes ya no es necesario

// Datos de ejemplo para la galería
const galleryItems = [
  { id: 1, src: 'https://plus.unsplash.com/premium_photo-1661401995801-4d86ba65d034?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zml0bmVzcyUyMG5lZ3JvfGVufDB8fDB8fHww', alt: 'Sesión de entrenamiento' },
  { id: 2, src: 'https://www.tiendaculturista.com/fotos/hortaleza3.jpg', alt: 'Nuestra tienda' },
  { id: 3, src: 'https://photos.peopleimages.com/picture/202305/2748153-hands-high-five-and-collaboration-of-people-in-gym-for-fitness-team-building-and-solidarity.-teamwork-group-of-friends-and-celebration-for-exercise-targets-goals-or-support-motivation-or-success-fit_400_400.jpg', alt: 'Nuestro equipo' },
  { id: 4, src: 'https://cdn.images.express.co.uk/img/dynamic/126/590x/1757445_1.jpg', alt: 'Transformación' },
  { id: 5, src: 'https://i.shgcdn.com/8315ff1a-82dc-4032-95b8-3f6d8ac1e815/-/format/auto/-/preview/3000x3000/-/quality/lighter/', alt: 'Antes y después' },
  { id: 6, src: 'https://media.istockphoto.com/id/1047643096/photo/personal-trainer-helping-mature-woman-at-gym.jpg?s=612x612&w=0&k=20&c=GPz6iwk5R65UHXD-Az-ToPH-S-phrh01wc0W57tMOvw=', alt: 'Asesoramiento Personalizado' },
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