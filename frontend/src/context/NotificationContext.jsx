// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos para las notificaciones

// Instala uuid si no lo tienes: npm install uuid
// O si usas yarn: yarn add uuid

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Función para añadir una notificación
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = uuidv4(); // Genera un ID único para la notificación
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message, type, duration },
    ]);

    // Eliminar la notificación después de 'duration' milisegundos
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  // Función para eliminar una notificación
  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};