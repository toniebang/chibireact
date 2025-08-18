// src/main.jsx
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import ProductProvider from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext';

import { GoogleOAuthProvider } from '@react-oauth/google';
import NotificationToast from './components/NotificationToast';

import RootLayout from './layouts/RootLayout'; // ⬅️ nuevo
import notfound from './assets/404.png';

import App from './App.jsx';
import About from './pages/About.jsx';
import ShopPage from './pages/ShopPage.jsx';
import Packs from './pages/Packs.jsx';
import Cart from './pages/Cart.jsx';
import ChibiSkinPage from './pages/ChibiSkinPage.jsx';
import FavoritesPage from './pages/FavoritePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Edit from './pages/Edit.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    element: <RootLayout />, // ⬅️ TODO cuelga de aquí
    children: [
      { path: '/', element: <App /> },
      { path: '/edit/', element: <Edit /> },
      { path: '/tienda/', element: <ShopPage /> },
      { path: '/favoritos', element: <FavoritesPage /> },
      { path: '/carrito/', element: <Cart /> },
      { path: '/sobre-chibi/', element: <About /> },
      { path: '/packs/', element: <Packs /> },
      { path: '/tienda/:id', element: <ProductDetails /> },
      { path: '/chibi-skin', element: <ChibiSkinPage /> },
      { path: '/perfil/', element: <ProfilePage /> },
      { path: '/auth', element: <AuthPage /> },
      {
        path: '/login/',
        loader: () => { window.location.replace('/auth'); return null; }
      },
      {
        path: '/registro/',
        loader: () => { window.location.replace('/auth?panel=register'); return null; }
      },
      {
        path: '*',
        element: (
          <div className='flex font-montserrat flex-col items-center justify-center min-h-screen bg-gray-100'>
            <img src={notfound} alt="" />
            <h1 className="text-chibi-green text-center text-4xl mt-20">Página no encontrada (404)</h1>
            <br />
            <span className="text-red-500">¡Ups! Parece que esta página no existe.</span>
            <br />
            Puedes volver a la <a href="/" className="text-blue-500 underline">página principal</a>.
          </div>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <NotificationProvider>
        <ProductProvider>
          <CartProvider>
            <AuthProvider>
              <FavoritesProvider>
                <RouterProvider router={router} />
              </FavoritesProvider>
            </AuthProvider>
          </CartProvider>
        </ProductProvider>
        <NotificationToast />
      </NotificationProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
