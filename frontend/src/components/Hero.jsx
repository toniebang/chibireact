// src/components/Hero.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/young-woman-training-gym-2.jpg';
import JoinModal from './JoinModal';

const Hero = () => {
  const [openJoin, setOpenJoin] = useState(false);

  return (
    <>
      <section
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
            <span className="text-chibi-green">Transforma</span> tu Vida con Chibi Fitness
          </h1>
          <p className="text-sm md:text-m lg:text-2xl mb-8">
            Entrenamientos personalizados, planes nutricionales, productos de cuidado y la motivación que necesitas para alcanzar tus metas.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Abrir modal de unirse */}
            <button
              type="button"
              onClick={() => setOpenJoin(true)}
              className="inline-block bg-chibi-green text-white font-bold py-3 px-4 text-sm hover:bg-black transition duration-300 rounded-full"
            >
              ÚNETE A CHIBI FITNESS
            </button>

            {/* CTA secundaria: explorar productos */}
            <Link
              to="/tienda"
              className="inline-block text-white font-bold py-3 px-4 text-sm border border-white hover:bg-black transition duration-300 rounded-full"
            >
              EXPLORAR PRODUCTOS
            </Link>
          </div>
        </div>
      </section>

      {openJoin && <JoinModal onClose={() => setOpenJoin(false)} />}
    </>
  );
};

export default Hero;
