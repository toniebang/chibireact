// src/main.jsx o src/index.jsx
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

// Importa tus Context Providers
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
// Importa el nuevo NotificationProvider
import { NotificationProvider } from './context/NotificationContext';

// Importa el componente de Toast
import NotificationToast from './components/NotificationToast';

import App from './App.jsx';
import About from './pages/About.jsx';
import ShopPage from './pages/ShopPage.jsx';
import Packs from './pages/Packs.jsx';
import Cart from './pages/Cart.jsx';
import LoginPage from './pages/LoginPage.jsx';

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
    path: '/login/',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: (
      <h1 className="text-white text-center text-4xl mt-20">
        Página no encontrada (404)
      </h1>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <ProductProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ProductProvider>
      <NotificationToast />
    </NotificationProvider>
  </StrictMode>
);