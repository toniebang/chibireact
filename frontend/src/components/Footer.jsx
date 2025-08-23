// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCaretRight,
  FaGithub,
  FaGooglePlusG,
  FaLinkedinIn,
  FaLink
} from 'react-icons/fa';

import footerLogo from '../assets/logochibi_blanco.png';
import TermsModal from './TermsModal'; // ⬅️ import del modal

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTerms, setShowTerms] = useState(false); // ⬅️ estado del modal

  const contactInfo = {
    ubicacion: 'Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon',
    tlf: '+240 555 308 250',
    correo: 'chibifeelgood@hotmail.com',
  };

  return (
    <>
      {/* Main footer */}
      <footer className="bg-black font-montserrat text-gray-300 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap -mx-4">
            {/* Columna 1: Logo y Descripción */}
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
              <div className="single-footer-widget">
                <div className="footer-logo mb-4">
                  <Link to="/" aria-label="Ir a Inicio">
                    <img src={footerLogo} alt="Chibi Fitness" className="h-14 w-auto" />
                  </Link>
                </div>

                <div className="caption-text mb-4">
                  <p className="text-sm leading-relaxed">
                    Tu transformación es nuestra pasión. Somos tus entrenadores personales, tus nutricionistas,
                    tus expertos en suplementos y tu grupo de apoyo. Proporcionamos la tecnología, herramientas
                    y productos que necesitas para quemar grasa, desarrollar músculo y convertirte en tu mejor versión.
                  </p>

                  <Link
                    to="/sobre-chibi"
                    className="inline-flex items-center mt-3.5 justify-center bg-chibi-green text-white font-medium py-2 px-4 text-xs rounded-full transition duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Conoce más sobre Chibi"
                  >
                    ACERCA DE NOSOTROS
                    <FaCaretRight className="ml-1 text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna 2: Links Directos */}
            <div className="w-full md:w-1/2 lg:w-4/12 px-4 mb-8 md:mb-0">
              <div className="single-footer-widget">
                <h3 className="title text-lg font-bold text-white mb-3">Links Directos</h3>
                <div className="flex justify-between gap-6">
                  <ul className="quick-links w-1/2 space-y-2 text-sm">
                    <li><Link to="/" className="hover:text-chibi-green transition-colors duration-200">Inicio</Link></li>
                    <li><Link to="/sobre-chibi" className="hover:text-chibi-green transition-colors duration-200">Acerca</Link></li>
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Nuestros precios</Link></li>
                    <li><Link to="/tienda" className="hover:text-chibi-green transition-colors duration-200">Tienda</Link></li>
                  </ul>

                  <ul className="quick-links w-1/2 space-y-2 text-sm">
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Dietas</Link></li>
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Asesoramiento</Link></li>
                    <li><Link to="/packs" className="hover:text-chibi-green transition-colors duration-200">Entrenamiento</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna 3: Contacto */}
            <div className="w-full md:w-1/2 lg:w-4/12 px-4">
              <div className="single-footer-widget">
                <h3 className="title text-lg font-bold text-white mb-3">Contacto</h3>
                <address className="not-italic">
                  <ul className="contact space-y-3">
                    <li className="flex items-start">
                      <div className="icon-holder mr-3 mt-0.5">
                        <FaMapMarkerAlt className="text-chibi-green text-lg" />
                      </div>
                      <div className="text">
                        <p className="text-sm">{contactInfo.ubicacion}</p>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <div className="icon-holder mr-3 mt-0.5">
                        <FaPhoneAlt className="text-chibi-green text-lg" />
                      </div>
                      <div className="text">
                        <a
                          href={`tel:${contactInfo.tlf.replace(/\s+/g, '')}`}
                          className="text-sm hover:text-chibi-green transition-colors duration-200"
                          aria-label={`Llamar al ${contactInfo.tlf}`}
                        >
                          {contactInfo.tlf}
                        </a>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <div className="icon-holder mr-3 mt-0.5">
                        <FaEnvelope className="text-chibi-green text-lg" />
                      </div>
                      <div className="text">
                        <a
                          href={`mailto:${contactInfo.correo}`}
                          className="text-sm hover:text-chibi-green transition-colors duration-200"
                          aria-label={`Enviar correo a ${contactInfo.correo}`}
                        >
                          {contactInfo.correo}
                        </a>
                      </div>
                    </li>
                  </ul>
                </address>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer bottom */}
      <section className="bg-black text-gray-400 py-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-3">
            <div className="copy-right">
              <p className="text-xs">
                © {currentYear} Chibi Feel Good — desarrollado por{' '}
                <a
                  href="https://www.antonioebangcv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-chibi-green transition-colors duration-200 inline-flex items-center"
                  aria-label="Abrir sitio de Antonio Ebang"
                >
                  Antonio Ebang
                  <FaLink className="inline-block ml-1 text-[10px]" />
                </a>
              </p>
            </div>

            {/* Botón: Términos y Condiciones */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                aria-haspopup="dialog"
                aria-expanded={showTerms}
                className="text-gray-400 hover:text-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded text-xs"
                title="Ver Términos y Condiciones"
              >
                Términos y Condiciones
              </button>

              <div className="social-links flex items-center space-x-4">
                <a
                  href="https://github.com/toniebang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <FaGithub className="text-lg" />
                </a>

                {/* Email */}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=antonioebang97@gmail.com&su=Desde la web Chibi&body=Hola%20Tony!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  aria-label="Enviar email"
                  title="Email"
                >
                  <FaGooglePlusG className="text-lg" />
                </a>

                <a
                  href="https://www.linkedin.com/in/antonio-ebang-tom%C3%A9-1498a1269"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-chibi-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedinIn className="text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render del modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
};

export default Footer;
