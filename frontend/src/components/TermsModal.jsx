import React from 'react';

const TermsModal = ({ onClose }) => {
  return (
    // Overlay oscuro de fondo
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Contenido del modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Términos y Condiciones de Uso</h3>
        <p className="text-gray-700 mb-4 text-sm">
          Bienvenido a ChibiBank. Al usar nuestros servicios, aceptas los siguientes términos y condiciones.
          Por favor, léelos cuidadosamente.
        </p>

        {/* Contenido de los términos (puedes añadir más párrafos o lista aquí) */}
        <div className="text-gray-600 text-xs leading-relaxed space-y-3">
          <p>
            <strong>1. Aceptación de los Términos:</strong> Al registrarte y utilizar ChibiBank, declaras
            que has leído, entendido y aceptado los presentes Términos y Condiciones de Uso, así como
            nuestra Política de Privacidad. Si no estás de acuerdo con estos términos, no debes
            utilizar nuestros servicios.
          </p>
          <p>
            <strong>2. Modificaciones:</strong> Nos reservamos el derecho de modificar o actualizar
            estos Términos y Condiciones en cualquier momento. Te notificaremos de cualquier cambio
            significativo. El uso continuado de la aplicación después de dichas modificaciones
            constituye tu aceptación de los nuevos términos.
          </p>
          <p>
            <strong>3. Uso de la Aplicación:</strong> ChibiBank está diseñado para facilitar la gestión
            financiera personal. Te comprometes a utilizar la aplicación de manera responsable y
            legal, sin infringir los derechos de terceros ni realizar actividades fraudulentas.
          </p>
          <p>
            <strong>4. Privacidad:</strong> Tu privacidad es de suma importancia para nosotros. Nuestra
            Política de Privacidad detalla cómo recopilamos, usamos y protegemos tu información personal.
            Al aceptar estos términos, también aceptas nuestra Política de Privacidad.
          </p>
          <p>
            <strong>5. Exención de Responsabilidad:</strong> Aunque nos esforzamos por mantener la
            precisión y disponibilidad de la aplicación, no garantizamos que ChibiBank sea ininterrumpido
            o libre de errores. No nos hacemos responsables de cualquier pérdida o daño que pueda surgir
            del uso o la imposibilidad de usar la aplicación.
          </p>
          <p>
            <strong>6. Propiedad Intelectual:</strong> Todo el contenido, características y funcionalidades
            de ChibiBank (incluyendo textos, gráficos, logotipos, iconos, imágenes y software) son
            propiedad de ChibiBank y están protegidos por leyes de derechos de autor, marcas registradas
            y otras leyes de propiedad intelectual.
          </p>
          <p>
            <strong>7. Ley Aplicable:</strong> Estos Términos y Condiciones se regirán e interpretarán
            de acuerdo con las leyes de [Tu País/Jurisdicción], sin dar efecto a ningún principio
            de conflicto de leyes.
          </p>
          <p className="text-right mt-4">Última actualización: 22 de junio de 2025</p>
        </div>

        {/* Botón para cerrar el modal */}
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