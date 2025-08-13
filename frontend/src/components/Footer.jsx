import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaCaretRight, 
  FaGithub,      // Icono de GitHub
  FaGooglePlusG, // Icono de Google Plus (nombre actualizado para react-icons)
  FaLinkedinIn,  // Icono de LinkedIn (nombre actualizado para react-icons)
  FaLink         // Icono de enlace
} from 'react-icons/fa'; 

import footerLogo from '../assets/logochibi_blanco.png'; 

const Footer = () => {
  const contactInfo = {
    ubicacion: 'Malabo, Bioko Norte, Guinea Ecuatorial',
    tlf: '+240 222 123 456', 
    correo: 'info@chibifitness.com', 
  };

  return (
    <> {/* Usamos un fragmento para envolver las dos secciones del footer */}
      <footer className="bg-black font-montserrat text-gray-300 py-12"> {/* Reducido el padding vertical */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap -mx-4">

            {/* Columna 1: Logo y Descripción */}
            <div className="w-full lg:w-4/12 px-4 mb-6 lg:mb-0"> {/* Margen reducido */}
              <div className="single-footer-widget">
                <div className="footer-logo mb-3"> {/* Margen reducido */}
                  <Link to="/">
                    <img src={footerLogo} alt="Logo Chibi Fitness" className="h-14 w-auto" /> {/* Altura del logo reducida */}
                  </Link>
                </div>
                <div className="caption-text mb-4"> {/* Margen reducido */}
                  <p className="text-xs leading-relaxed"> {/* Texto más pequeño */}
                    Tu transformación es nuestra pasión. Somos tus entrenadores personales, tus nutricionistas,
                    tus expertos en suplementos, tu compañero de levantamiento, tu grupo de apoyo. Proporcionamos
                    la tecnología, herramientas y productos que necesitas para quemar grasa, desarrollar músculo
                    y convertirte en tu mejor versión.
                  </p>
                  <Link 
                    to="/sobre-chibi" 
                    className="inline-block bg-chibi-green text-white font-medium py-1.5 px-3 text-xs {/* Tamaño de texto y padding reducidos */}
                               hover:bg-black transition duration-300 mt-3" 
                  >
                    <span>ACERCA DE NOSOTROS<FaCaretRight className="inline-block ml-1" /></span> {/* Margen del icono reducido */}
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna 2: Links Directos */}
            <div className="w-full md:w-1/2 lg:w-4/12 px-4 mb-6 md:mb-0"> {/* Margen reducido */}
              <div className="single-footer-widget">
                <h3 className="title text-lg font-bold text-white mb-3">Links Directos</h3> {/* Título más pequeño */}
                <div className="flex justify-between">
                  <ul className="quick-links w-1/2 space-y-1 text-xs"> {/* Espaciado y texto más pequeño */}
                    <li><Link to="/" className="hover:text-chibi-green transition-colors duration-200">Inicio</Link></li>
                    <li><Link to="/sobre-chibi" className="hover:text-chibi-green transition-colors duration-200">Acerca</Link></li>
            
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Nuestros precios</Link></li>
                    <li><Link to="/tienda" className="hover:text-chibi-green transition-colors duration-200">Tienda</Link></li>
                  </ul>
                  <ul className="quick-links w-1/2 space-y-1 text-xs"> {/* Espaciado y texto más pequeño */}
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Dietas</Link></li>
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Asesoramiento</Link></li>
                    <li><Link to="/tienda/categoria/te" className="hover:text-chibi-green transition-colors duration-200">Tes de Chibi</Link></li>
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Entrenamiento</Link></li>
                    <li><Link to="/tienda/categoria/suplementos" className="hover:text-chibi-green transition-colors duration-200">Suplementos</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna 3: Contacto */}
            <div className="w-full md:w-1/2 lg:w-3/12 px-4">
              <div className="single-footer-widget">
                <h3 className="title text-lg font-bold text-white mb-3">Contacto</h3> {/* Título más pequeño */}
                <ul className="contact space-y-2"> {/* Espaciado reducido */}
                  <li className="flex items-start">
                    <div className="icon-holder mr-2 mt-0.5"> {/* Ajuste de margen para alinear el icono */}
                      <FaMapMarkerAlt className="text-chibi-green text-lg" /> {/* Tamaño de icono reducido */}
                    </div>
                    <div className="text">
                      <p className="text-xs">{contactInfo.ubicacion}</p> {/* Texto más pequeño */}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="icon-holder mr-2 mt-0.5">
                      <FaPhoneAlt className="text-chibi-green text-lg" />
                    </div>
                    <div className="text">
                      <p className="text-xs">{contactInfo.tlf}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="icon-holder mr-2 mt-0.5">
                      <FaEnvelope className="text-chibi-green text-lg" />
                    </div>
                    <div className="text">
                      <p className="text-xs">{contactInfo.correo}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Start footer bottom area */}
      <section className="bg-black text-gray-400 py-4"> {/* Nuevo fondo, padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="copy-right mb-2 md:mb-0"> {/* Margen inferior en móviles */}
              <p className="text-xs"> {/* Texto más pequeño */}
                © {new Date().getFullYear()} Chibi Feel Good - desarrollado por{' '}
                <a 
                  href="https://www.antonioebangcv.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-chibi-green transition-colors duration-200"
                >
                  Antonio Ebang <FaLink className="inline-block ml-0.5 text-xs" /> {/* Icono de enlace y texto más pequeño */}
                </a>
              </p>
            </div>
            <div className="social-links flex space-x-4"> {/* Contenedor flex para los iconos sociales */}
              <a 
                href="https://github.com/toniebang" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-chibi-green transition-colors duration-200"
              >
                <FaGithub className="text-lg" /> {/* Icono más grande */}
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&to=antonioebang97@gmail.com&su=Desde la web Chibi&body='Hola Tony!'" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-chibi-green transition-colors duration-200"
              >
                <FaGooglePlusG className="text-lg" /> 
              </a>
              <a 
                href="https://www.linkedin.com/in/antonio-ebang-tom%C3%A9-1498a1269" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-chibi-green transition-colors duration-200"
              >
                <FaLinkedinIn className="text-lg" /> 
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;