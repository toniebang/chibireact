import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Icono de flecha hacia arriba

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para detectar si el botón debe ser visible
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Muestra el botón si el scroll es mayor a 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función para hacer scroll al principio de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Animación suave
    });
  };

  useEffect(() => {
    // Añade el event listener para el scroll cuando el componente se monta
    window.addEventListener('scroll', toggleVisibility);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar y desmontar

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-chibi-green cursor-pointer text-white p-3 rounded-full shadow-lg 
                  hover:bg-black transition-all duration-300 z-50
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="Volver arriba"
    >
      <FaArrowUp className="text-xl" />
    </button>
  );
};

export default ScrollToTopButton;