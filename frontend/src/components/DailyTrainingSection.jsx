import React from 'react';
import { FaCheck } from 'react-icons/fa';
import foto from '../assets/i-phone.png'; // Imagen del iPhone

const DailyTrainingSection = () => {
  return (
    <section 
      className="py-16" // Se elimina 'bg-white' ya que la imagen de fondo la reemplaza
      style={{ 
      
        backgroundColor: '#000', // Color de fondo
        backgroundSize: 'cover',      // Asegura que la imagen cubra toda el área
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat' // Evita que la imagen se repita
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:gap-12">

          <div className="w-full md:w-1/2 lg:w-7/12 mb-8 md:mb-0">
            <div className="img-holder">
              <img 
                src={foto} 
                alt="Teléfono mostrando un plan de entrenamiento y dieta" 
                className="w-full h-auto object-contain mx-auto max-w-sm md:max-w-none" 
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left">
            <div className="content">
              <h1 className="text-3xl md:text-4xl font-light text-chibi-green mb-4">
                HAZ TU PLAN DIARIO DE ENTRENAMIENTO Y DIETA CON NOSOTROS
              </h1>
              <p className="text-lg text-white mb-6">
                Será perfecto para tu salud y la de los que forman parte de tu vida.
              </p>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Consigue el cuerpo fitness que todos desean
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Controla los resultados
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Forma parte de una comunidad
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyTrainingSection;