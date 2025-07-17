// src/main.jsx o src/index.jsx
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

// Importa tus Context Providers
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext.jsx';

import notfound from './assets/404.png'; // Asegúrate de que esta ruta sea correcta para tu imagen 404
// Importa el componente de Toast
import NotificationToast from './components/NotificationToast';


import App from './App.jsx';
import About from './pages/About.jsx';
import ShopPage from './pages/ShopPage.jsx';
import Packs from './pages/Packs.jsx';
import Cart from './pages/Cart.jsx';
import Perfil from './pages/Perfil.jsx'; // Asegúrate de que esta ruta sea correcta para tu página de perfil
import ProductDetail from './pages/ProductDetail.jsx'; // Asegúrate de que esta ruta sea correcta para tu página de detalles del producto
// ¡IMPORTA EL NUEVO AuthPage en lugar de LoginPage!
import AuthPage from './pages/AuthPage.jsx'; // <--- ¡Importación del nuevo AuthPage!

// ¡IMPORTA EL GOOGLE OAUTH PROVIDER!
import { GoogleOAuthProvider } from '@react-oauth/google';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Opcional: Verificación para depuración
if (!googleClientId) {
  console.error("ADVERTENCIA: VITE_GOOGLE_CLIENT_ID no está definido en las variables de entorno. El inicio de sesión con Google podría no funcionar.");
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/tienda/',
    element: <ShopPage/>,
  },
  {
    path: '/carrito/',
    element: <Cart/>,
  },
  {
    path: '/sobre-chibi/',
    element: <About/>,
  },
  {
    path: '/packs/',
    element: <Packs />,
  },
  {
    path: '/detalles/',
    element: <ProductDetail />,
  },
  {
    path: '/perfil/',
    element: <Perfil />,
  },
  // --- NUEVAS RUTAS PARA AUTH ---
  {
    path: '/auth', // Esta será la ruta principal que renderizará el AuthPage con los paneles
    element: <AuthPage />,
  },
  {
    path: '/login/', // Si alguien intenta ir a /login/, lo redirigimos a /auth
    loader: () => {
      window.location.replace('/auth'); // Redirección directa en el navegador
      return null; // El loader debe retornar algo
    }
  },
  {
    path: '/registro/', // Si alguien intenta ir a /registro/, lo redirigimos a /auth?panel=register
    loader: () => {
      window.location.replace('/auth?panel=register'); // Redirección con parámetro para el panel de registro
      return null;
    }
  },
  // --- FIN NUEVAS RUTAS PARA AUTH ---
  {
    path: '*',
    element: (
      <div className='flex font-montserrat flex-col items-center justify-center min-h-screen bg-gray-100'>
      <img src={notfound} alt="" />
      <h1 className="text-chibi-green text-center text-4xl mt-20">
        Página no encontrada (404)
        </h1>
        <br />
        <span className="text-red-500">¡Ups! Parece que esta página no existe.</span>
        <br />
        Puedes volver a la <a href="/" className="text-blue-500 underline">página principal</a>.
      
      </div>
    ),
  },
], {
  basename: '/chibireact-frontend/', // Asegúrate de que este basename coincida con la configuración de tu servidor
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <NotificationProvider>
        <ProductProvider>
          <CartProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
          </CartProvider>
        </ProductProvider>
        <NotificationToast />
      </NotificationProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);