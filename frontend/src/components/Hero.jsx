import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/5-3.jpg'; // Asegúrate de tener una imagen de fitness aquí

console.log('Valor de heroImage:', heroImage);
const Hero = () => {
  return (
    <section 
      className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage:`url(${heroImage})`}}
    >
      {/* Overlay oscuro para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido del Hero */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-up">
          Transforma tu Vida con Chibi Fitness
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 animate-fade-in-up delay-200">
          Entrenamientos personalizados, planes nutricionales y la motivación que necesitas para alcanzar tus metas.
        </p>
        <Link 
          to="/planes" // Cambiamos la CTA a una ruta más relevante para fitness, como '/planes' o '/entrenamientos'
          className="inline-block bg-chibi-green hover:bg-chibi-green text-white font-bold py-3 px-8 rounded-full text-lg md:text-xl transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up delay-400"
        >
          Explora Nuestros Planes
        </Link>
      </div>
    </section>
  );
};

export default Hero;