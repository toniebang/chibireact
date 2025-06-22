// src/components/NotificationToast.jsx
import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { IoCloseCircleOutline } from "react-icons/io5"; // Para cerrar manualmente

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  const getToastClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-700';
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-700';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-xs w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center justify-between text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-out 
                      ${getToastClasses(notif.type)}
                      ${notif.type === 'error' ? 'animate-shake' : ''} pointer-events-auto`}
          role="alert"
        >
          <span className="flex-1 text-sm font-medium">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar notificación"
          >
            <IoCloseCircleOutline className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;