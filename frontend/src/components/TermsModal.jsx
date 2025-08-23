import React from 'react';

const TermsModal = ({ onClose }) => {
  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      {/* Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">Términos y Condiciones</h3>

        <p className="text-gray-700 mb-4 text-sm">
          ¡Hola! Gracias por usar <span className="font-semibold">Chibi</span>.{" "}
          Este texto explica de forma sencilla cómo funciona todo por aquí. Si continúas, entendemos que estás de acuerdo.
        </p>

        <div className="text-gray-700 text-sm leading-relaxed space-y-4">
          <p>
            <span className="block font-semibold mb-1">1) ¿Qué es Chibi?</span>
            Una tienda y espacio de bienestar: productos, tés/infusiones, cuidado personal y contenidos
            pensados para ayudarte a sentirte mejor, sin complicaciones.
          </p>

          <p>
            <span className="block font-semibold mb-1">2) Tu cuenta y buen uso</span>
            Si creas una cuenta, cuida tu contraseña. Usa Chibi de forma respetuosa y legal. Nada de fraude,
            suplantaciones o usos raros. Aquí venimos a estar bien 💚.
          </p>

          <p>
            <span className="block font-semibold mb-1">3) Cambios en estos términos</span>
            A veces mejoramos cosas y este texto puede actualizarse. Si hay cambios importantes, lo avisaremos.
            Seguir usando Chibi significa que estás ok con la versión nueva.
          </p>

          <p>
            <span className="block font-semibold mb-1">4) Privacidad, sin dramas</span>
            Cuidamos tus datos y los usamos solo para darte un buen servicio. Tienes más detalles en nuestra
            Política de Privacidad. No nos gusta el spam y tampoco vender tus datos.
          </p>

          <p>
            <span className="block font-semibold mb-1">5) Salud y bienestar (nota importante)</span>
            Lo que compartimos (tés, consejos, rutinas) es general y no reemplaza la opinión de un profesional
            de la salud. Si tienes alguna condición, dudas o tomas medicación, consulta primero con tu médico.
          </p>

          <p>
            <span className="block font-semibold mb-1">6) Disponibilidad</span>
            Trabajamos para que todo funcione genial, pero Internet a veces se cae o las cosas tardan.
            Si algo falla, lo arreglaremos cuanto antes.
          </p>

          <p>
            <span className="block font-semibold mb-1">7) Contenidos y marcas</span>
            El nombre Chibi, imágenes, textos y software pertenecen a Chibi. Puedes usarlos para disfrutar de
            la web/app, pero no para copiarlos o revenderlos como propios.
          </p>

          <p>
            <span className="block font-semibold mb-1">8) Compras y devoluciones</span>
            En cada producto verás el precio, disponibilidad y, si aplica, las condiciones de envío y devolución.
            Si algo no cuadra, escríbenos: nos gusta resolver rápido y bien.
          </p>

          <p className="text-right text-xs text-gray-500 mt-4">
            Última actualización: 23 de agosto de 2025
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-chibi-green hover:bg-chibi-dark-green text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
