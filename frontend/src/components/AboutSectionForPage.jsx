import React from 'react';
import planImg from '../assets/offer-products-1.jpg'; // Imagen dentro del img-holder
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
    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-4 text-black">
      SOMOS EL TEAM CHIBI
    </h2>

    <span className="block text-l md:text-l mb-4 text-chibi-green">
      Bienvenido a Chibi: una forma cercana y sencilla de cuidarte.
    </span>

    <p className="text-sm opacity-80 md:text-m leading-relaxed mb-3 text-gray-700 font-light">
      Nacimos con una idea clara: hacer fácil lo saludable. Somos un equipo de personas que cree en
      los cambios reales, en los hábitos que se disfrutan y en el acompañamiento de verdad. En Chibi,
      cada paso se adapta a tu ritmo: te escuchamos, te guiamos y celebramos tus logros contigo.
    </p>

    <p className="text-sm opacity-80 md:text-m leading-relaxed mb-3 text-gray-700 font-light">
      Creamos un universo que te cuida por dentro y por fuera: bienestar, movimiento y cuidado
      personal, con esa energía verde que nos identifica. No buscamos perfección, buscamos
      constancia. Porque cuando te sientes bien, todo fluye mejor.
    </p>

    <p className="text-sm opacity-80 md:text-m leading-relaxed mb-6 text-gray-700 font-light">
      Este es nuestro compromiso: hacerlo simple, hacerlo real, hacerlo contigo.
    </p>

    <div className="border-b border-gray-700 w-24 mx-auto md:mx-0 mb-4"></div>

    <h4 className="text-3xl md:text-3xl font-bold text-black opacity-15 mt-6">
      COMPROMETIDOS CON TU ÉXITO
    </h4>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;