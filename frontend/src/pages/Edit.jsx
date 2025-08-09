import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductsManagementList from '../components/ProductsManagementList';

const Edit = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user?.is_superuser) {
    return (
      <div className="max-w-3xl mx-auto mt-20 p-6 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg shadow-lg">
        <p className="font-semibold">Acceso denegado.</p>
        <p>Solo los superadministradores pueden acceder a esta página.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-4 mt-24 font-montserrat">
        <ProductsManagementList />
      </main>
      <Footer />
    </>
  );
};

export default Edit;
