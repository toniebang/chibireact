import React from 'react';
import planImg from '../assets/plan-img.png'; // Imagen dentro del img-holder
import sectionBg from '../assets/perfect-plan-bg.png'; // ¡La imagen de fondo de la sección
const AboutSection = () => {
  return (
    <section 
      id="comenzar" 
      className="relative py-16 md:py-24 text-white bg-cover bg-center" // Añadido relative, bg-cover, bg-center
      style={{ backgroundImage: `url(${sectionBg})` }} // <--- ¡Imagen de fondo aquí!
    >
      {/* Opcional: Overlay oscuro para mejorar la legibilidad del texto sobre la imagen de fondo */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>  */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Contenedor centrado y responsivo, z-10 para estar sobre el overlay */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12"> 
          {/* Columna de la Imagen */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0"> 
            <div className="perfect-plan-left"> 
              <div className="img-holder  overflow-hidden"> 
                <img src={planImg} alt="Plan Perfecto Chibi Fitness" className="w-full h-auto object-cover" /> 
              </div>
            </div>
          </div>

          {/* Columna del Contenido de Texto */}
          <div className="w-full md:w-1/2 fitness-video-area"> 
            <div className="perfect-plan-right right-text"> 
              <h2 className="text-xl md:text-xl lg:text-xl font-semibold leading-tight mb-4 text-black">
                SOMOS LA OPCION PERFECTA PARA TU TRANSFORMACIÓN
              </h2>
              <span className="block text-l md:text-l  mb-4 text-chibi-green"> 
                En Chibi te acompañamos de la mano hasta que puedas lograr tu objetivo.
              </span>
              <p className="text-sm opacity-80 md:text-m leading-relaxed mb-6 text-gray-700 font-light">
                Diseñamos un plan alimenticio que se ajuste a tus necesidades, tenemos una amplia gama de tés para acompañar a cualquiera que sea su objetivo y le
                ofrecemos opciones de entrenamiento para un resultado más óptimo.
              </p>
              <div className="border-b border-gray-700 w-24 mx-auto md:mx-0 mb-4"></div> 
              
              <h4 className="text-3xl md:text-3xl font-bold text-black opacity-15 mt-6">
                COMPROMETIDOS CON TU EXITO
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;