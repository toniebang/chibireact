// src/components/JoinModal.jsx
import React from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt, FaUserPlus } from 'react-icons/fa';

const JoinModal = ({
  onClose,
  whatsappUrl = 'https://whatsapp.com/channel/0029VaDbgNUFXUujxd01Hk0a',
  phone = '+240 555 3082 50',
}) => {
  return (
    <Modal onClose={onClose}>
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Únete a Chibi Fitness
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Empieza hoy mismo. Crea tu cuenta, únete a nuestro grupo y da el primer paso hacia tu mejor versión.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {/* Crear cuenta */}
          <Link
            to="/auth?panel=register"
            className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-3 px-4 hover:bg-gray-800 rounded-none"
            onClick={onClose}
          >
            <FaUserPlus />
            Crear cuenta
          </Link>

          {/* Unirse por WhatsApp (grupo/canal) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-chibi-green text-white py-3 px-4 hover:bg-chibi-green-dark rounded-none"
            onClick={onClose}
          >
            <FaWhatsapp />
            Unirme por WhatsApp
          </a>

          {/* Llamar */}
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 py-3 px-4 hover:bg-gray-50 rounded-none"
            onClick={onClose}
          >
            <FaPhoneAlt />
            Llamar: {phone}
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default JoinModal;
