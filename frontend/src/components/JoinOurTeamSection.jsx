import React from 'react';
import { FaUsers, FaHeartbeat, FaHandshake, FaArrowRight } from 'react-icons/fa'; 

const JoinOurTeamSection = () => {
  return (
    <section className="py-20 bg-gray-900 text-white text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
          ¡Entrena, Conecta y Crece <span className="text-chibi-green">con Nuestra Comunidad!</span>
        </h2>
        <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto">
          En Chibi Feel Good, creemos en el poder de la conexión y el <span className="font-semibold">bienestar compartido</span>. 
          Si buscas unirte a un grupo de personas apasionadas por el fitness, compartir entrenamientos, 
          participar en actividades divertidas y motivarte mutuamente, ¡este es tu lugar! 
          Descubre cómo vivir el fitness de una forma más <span className="font-semibold">divertida y social</span>.
        </p>
        
        {/* Beneficios de unirse a la comunidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-gray-300">
            <div className="flex flex-col items-center">
                <FaHeartbeat className="text-chibi-green text-3xl mb-2" />
                <h4 className="font-semibold text-lg mb-1">Entrenos Compartidos</h4>
                <p className="text-sm leading-relaxed">
                  Disfruta de sesiones grupales, retos colaborativos y encuentra compañeros para cada entreno.
                </p>
            </div>
            <div className="flex flex-col items-center">
                <FaHandshake className="text-chibi-green text-3xl mb-2" />
                <h4 className="font-semibold text-lg mb-1">Apoyo y Motivación</h4>
                <p className="text-sm leading-relaxed">
                  Rodéate de una comunidad que te impulsa a superar tus límites y celebrar cada logro.
                </p>
            </div>
            <div className="flex flex-col items-center">
                <FaUsers className="text-chibi-green text-3xl mb-2" />
                <h4 className="font-semibold text-lg mb-1">Actividades Exclusivas</h4>
                <p className="text-sm leading-relaxed">
                  Participa en eventos especiales, salidas al aire libre y experiencias únicas con tu grupo.
                </p>
            </div>
        </div>

        {/* Botón de Llamada a la Acción */}
        <a
          href="/contacto" // Enlace al contacto
          className="inline-flex items-center bg-chibi-green text-white py-2 px-6 
                     hover:bg-black transition-colors duration-300 text-base shadow-lg
                     transform hover:scale-105"
        >
          Nuestro Contacto
          <FaArrowRight className="ml-2 text-lg" />
        </a>
      </div>
    </section>
  );
};

export default JoinOurTeamSection;