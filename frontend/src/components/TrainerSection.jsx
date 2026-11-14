// src/components/TrainerSection.jsx
import React, { useState } from "react";
import hector1 from "../assets/trainer.jpg";
import hector2 from "../assets/hector.jpg";
import ContactBookingModal from "./ContactBookingModal";
import SectionHeading from "./SectionHeading";

const TrainerSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-chibi-ink text-white pb-16 md:py-28" aria-label="Entrenador">
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 grid md:grid-cols-2 gap-7 md:gap-16 lg:gap-20 md:items-center">
        {/* Imágenes */}
        <div className="grid grid-cols-5 gap-3 md:gap-4 items-start">
          <img
            src={hector1}
            alt="Héctor entrenador"
            loading="lazy"
            className="col-span-5 md:col-span-3 w-full h-[420px] md:h-[600px] object-cover object-[center_15%]"
          />
          <img
            src={hector2}
            alt="Héctor entrenamiento"
            loading="lazy"
            className="hidden md:block col-span-2 w-full h-[360px] object-cover mt-28"
          />
        </div>

        {/* Texto */}
        <div className="px-5 sm:px-6 md:px-0 flex flex-col gap-5 md:gap-6">
          <SectionHeading eyebrow="Chibi Sport" tone="light" size="md">
            Conoce a nuestro entrenador estrella
          </SectionHeading>
          <p className="chibi-display text-chibi-green text-[clamp(3.25rem,17vw,5.25rem)] sm:text-8xl lg:text-[clamp(4.5rem,7.6vw,6.75rem)]">
            El_Shabazz
          </p>
          <p className="text-[15px] md:text-base leading-7 text-[#d5d8ca] max-w-lg">
            Tenemos al mejor entrenador: <span className="font-semibold text-white">El_Shabazz</span>.
            Con su experiencia y métodos innovadores, te ayuda a transformar tu cuerpo en menos de dos meses.
            Entrena con disciplina, pasión y resultados garantizados.
          </p>
          <div>
            <button type="button" onClick={() => setOpen(true)} className="chibi-btn chibi-btn-white w-full sm:w-auto">
              Reserva una sesión ahora
            </button>
          </div>
        </div>
      </div>

      {/* Modal de contacto */}
      <ContactBookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        phone="+240555308250"
        prefilledText="Hola Chibi, quiero reservar una sesión con Héctor. ¿Podemos coordinar?"
      />
    </section>
  );
};

export default TrainerSection;
