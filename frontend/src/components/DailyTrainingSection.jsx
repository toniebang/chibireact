import React from 'react';
import { FaCheck } from 'react-icons/fa';
// ¡IMPORTAMOS LA IMAGEN DE LA TIENDA!
import chibishop from '../assets/chibishop.jpg'; // Asegúrate de que 'chibishop.jpg' esté en tu carpeta 'src/assets/'

const DailyTrainingSection = () => { // Considera renombrar este componente a algo como 'OurShopSection'
  return (
    <section
      className="py-16"
      style={{
        backgroundColor: '#000', // Mantenemos el fondo negro como solicitaste
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:gap-12">

          {/* COLUMNA DE LA IMAGEN: Ahora muestra chibishop.jpg */}
          <div className="w-full md:w-1/2 lg:w-7/12 mb-8 md:mb-0">
            <div className="img-holder">
              <img
                src={chibishop} // ¡IMAGEN CAMBIADA A chibishop.jpg!
                alt="Fachada de Chibi Shop en Malabo" // Texto alternativo adaptado
                className="w-full h-auto object-contain mx-auto max-w-sm md:max-w-none  shadow-xl" // Estilos para la imagen de la tienda
              />
            </div>
          </div>

          {/* COLUMNA DEL CONTENIDO: Ahora habla de la tienda */}
          <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left">
            <div className="content">
              <h1 className="text-3xl md:text-4xl font-light text-chibi-green mb-4">
                VISITA NUESTRA TIENDA FÍSICA EN MALABO
              </h1>
              <p className="text-m text-white mb-6">
                Descubre toda la variedad de productos de Chibi Shop en persona. Nos puedes encontrar fácilmente en <span className="font-bold">Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon</span>
              </p>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Amplia selección de skincare, deportes, tés y más
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Asesoramiento personalizado de nuestros expertos
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaCheck className="text-chibi-green mr-2" />
                  Un ambiente acogedor para tu bienestar integral
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