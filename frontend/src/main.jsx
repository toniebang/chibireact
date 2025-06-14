import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css'; // ¡Importante para tus estilos de Tailwind!

import App from './App.jsx'; // Tu App.jsx ahora es el layout

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App.jsx es tu layout raíz
    children: [ // Las rutas anidadas irán aquí cuando las crees
      {
        index: true, // Esta es la ruta por defecto para el path '/'
        element: (
          <h1 className="text-white text-center text-3xl mt-10">
            ¡Bienvenido a Chibi! <br /> Tu Header está listo.
          </h1>
        ),
      },
      {
        path: '*', // Ruta comodín para cualquier otra URL no definida (página 404)
        element: (
          <h1 className="text-white text-center text-4xl mt-20">
            Página no encontrada (404)
          </h1>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Aquí irían tus Context Providers si los necesitas en el futuro */}
    <RouterProvider router={router} />
  </StrictMode>
);