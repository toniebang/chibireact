// src/components/TrainerSection.jsx
import React, { useState } from "react";
import hector1 from "../assets/hector.jpg";
import hector2 from "../assets/hector2.jpg";
import ContactBookingModal from "./ContactBookingModal";

const TrainerSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conoce a nuestro entrenador estrella
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Tenemos al mejor entrenador: <span className="font-semibold">El_Shabazz</span>.  
            Con su experiencia y métodos innovadores, te ayuda a transformar tu cuerpo en menos de dos meses.  
            Entrena con disciplina, pasión y resultados garantizados.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="bg-chibi-green text-white px-6 py-3 cursor-pointer shadow hover:bg-black transition-colors duration-300 rounded-full"
          >
            Reserva una sesión ahora
          </button>
        </div>

        {/* Imágenes */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src={hector1}
            alt="Héctor entrenador"
            className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          />
          <img
            src={hector2}
            alt="Héctor entrenamiento"
            className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Modal de contacto */}
      <ContactBookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        phone="+240555766714"
        prefilledText="Hola Chibi, quiero reservar una sesión con Héctor. ¿Podemos coordinar?"
      />
    </section>
  );
};

export default TrainerSection;
