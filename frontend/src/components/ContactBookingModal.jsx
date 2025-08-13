// src/components/ContactBookingModal.jsx
import React, { useMemo } from "react";
import Modal from "./Modal";
import { Phone, MessageCircle } from "lucide-react"; // o react-icons si prefieres

const ContactBookingModal = ({
  isOpen,
  onClose,
  phone = "+240555766714",           // ← tu número (sin espacios)
  prefilledText = "Hola Chibi, quiero reservar una sesión con Héctor.",
}) => {
  const waLink = useMemo(() => {
    // Formato correcto: https://wa.me/<phone>?text=<encoded>
    const txt = encodeURIComponent(prefilledText);
    return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${txt}`;
  }, [phone, prefilledText]);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-2">
        <h3 className="text-xl font-semibold text-gray-900">Reserva tu sesión</h3>
        <p className="mt-2 text-sm text-gray-600">
          Elige cómo quieres contactar con nosotros. Te atenderemos lo antes posible.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Llamar */}
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 hover:bg-gray-800 transition rounded-none"
          >
            <Phone size={18} />
            Llamar ahora
          </a>

          {/* WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 hover:bg-green-600 transition rounded-none"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full border border-gray-300 py-2 px-4 text-gray-800 hover:bg-gray-50 transition rounded-none"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default ContactBookingModal;
