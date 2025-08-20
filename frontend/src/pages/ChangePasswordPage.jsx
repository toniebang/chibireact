import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ChangePasswordPage = () => {
  const { authAxios, loading: authBusy, logout } = useAuth();
  const { addNotification } = useNotifications();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [busy, setBusy] = useState(false);
  const [logoutEverywhere, setLogoutEverywhere] = useState(false);

  // Ajusta si tu endpoint es distinto:
  // Backend recomendado: POST /api/password/change/ con { old_password, new_password }
  const ENDPOINT = '/password/change/';

  const validate = () => {
    if (!currentPassword || !newPassword || !confirm) {
      addNotification('Rellena todos los campos.', 'error');
      return false;
    }
    if (newPassword !== confirm) {
      addNotification('Las contraseñas no coinciden.', 'error');
      return false;
    }
    if (newPassword.length < 8) {
      addNotification('La nueva contraseña debe tener al menos 8 caracteres.', 'error');
      return false;
    }
    if (newPassword === currentPassword) {
      addNotification('La nueva contraseña debe ser diferente a la actual.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy || authBusy) return;
    if (!validate()) return;

    setBusy(true);
    try {
      await authAxios.post(ENDPOINT, {
        old_password: currentPassword,
        new_password: newPassword,
      });

      addNotification('Contraseña actualizada correctamente.', 'success');

      if (logoutEverywhere) {
        // Cierra sesión (llama a /logout/ y limpia tokens)
        await logout(true);
        // tras logout, AuthContext ya navega o puedes redirigir desde tu router
        return;
      }

      // Limpia campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      const apiErr =
        err?.response?.data ??
        { detail: 'No se pudo cambiar la contraseña. Intenta nuevamente.' };

      // Muestra mensajes “amables”
      const detail =
        typeof apiErr === 'string'
          ? apiErr
          : apiErr.detail ||
            apiErr.message ||
            Object.entries(apiErr)
              .map(([k, v]) =>
                Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${v}`
              )
              .join(' ');

      addNotification(detail || 'Error desconocido al cambiar la contraseña.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 md:px-6 mt-24 mb-16">
        <div className="bg-white p-8 shadow-xl w-full transform transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
            Cambiar contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña actual */}
            <div>
              <label htmlFor="cur-pass" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  id="cur-pass"
                  type={showCur ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                             placeholder-gray-400 text-gray-900 pr-12
                             focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                             sm:text-base transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCur(!showCur)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                >
                  {showCur ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="new-pass" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="new-pass"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                             placeholder-gray-400 text-gray-900 pr-12
                             focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                             sm:text-base transition-all duration-200"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                >
                  {showNew ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Consejo: usa una frase con números y símbolos.
              </p>
            </div>

            {/* Confirmación */}
            <div>
              <label htmlFor="conf-pass" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="conf-pass"
                  type={showConf ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                             placeholder-gray-400 text-gray-900 pr-12
                             focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                             sm:text-base transition-all duration-200"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                >
                  {showConf ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Opcional: cerrar sesión tras cambio */}
            <div className="flex items-center gap-2">
              <input
                id="logout-all"
                type="checkbox"
                className="w-4 h-4"
                checked={logoutEverywhere}
                onChange={(e) => setLogoutEverywhere(e.target.checked)}
              />
              <label htmlFor="logout-all" className="text-sm text-gray-700">
                Cerrar mi sesión al terminar
              </label>
            </div>

            <button
              type="submit"
              disabled={busy || authBusy}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm
                         text-lg font-semibold text-white bg-chibi-green
                         hover:bg-chibi-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chibi-green
                         transition-colors duration-300 transform hover:-translate-y-0.5
                         disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {busy ? 'Guardando…' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ChangePasswordPage;
