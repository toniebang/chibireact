// src/components/Modal.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose, title = 'Gestión', footer = null }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true));
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handleEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
                  bg-black/40 backdrop-blur-[2px] transition-opacity duration-150
                  ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          w-full
          max-w-md md:max-w-xl lg:max-w-2xl p-4 font-montserrat    /* 👈 responsivo */
          bg-white rounded-none shadow-xl border border-gray-100
          overflow-hidden flex flex-col
          transform transition-transform duration-150
          ${show ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex items-center justify-center h-8 w-8 rounded-full
                       text-gray-600 hover:text-white hover:bg-chibi-green focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer sticky */}
        {footer && (
          <div className="px-5 py-3 border-t border-gray-100 bg-white sticky bottom-0">
            <div className="flex justify-end gap-3">{footer}</div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
