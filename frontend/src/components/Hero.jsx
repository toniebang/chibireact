import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/young-woman-training-gym-2.jpg'; // Asegúrate de tener una imagen de fitness aquí




const Hero = () => {
  return (
    
    <section 
      className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage:`url(${heroImage})`}}
    >
      {/* Overlay oscuro para mejorar la legibilidad del texto */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

      {/* Contenido del Hero */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-up">
          <span className="text-chibi-green">Transforma</span> tu Vida con Chibi Fitness
        </h1>
        <p className="text-sm md:text-m lg:text-2xl mb-8 animate-fade-in-up delay-200">
          Entrenamientos personalizados, planes nutricionales y la motivación que necesitas para alcanzar tus metas.
        </p>
        <div className='flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6'>
          <Link
            to="/planes" 
            className="inline-block bg-chibi-green border-l-2 font-bold  text-white   py-2 px-4  text-sm md:text-sm hover:bg-black transition duration-600 ease-in-out"
          >
          ÚNETE A CHIBI FITNESS
          </Link>
          <Link
            to="/planes" // Cambiamos la CTA a una ruta más relevante para fitness, como '/planes' o '/entrenamientos'
            className="inline-block  border-1 font-bold   text-white  py-2 px-4  text-sm md:text-sm hover:bg-black transition duration-600 ease-in-out"
          >
            EXPLORAR PRODUCTOS
          </Link>
        </div>
      </div>
      {/* Animación de entrada */}
      
    </section>
  );
};

export default Hero;