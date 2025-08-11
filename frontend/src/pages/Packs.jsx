import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

const Packs = () => {
    return (
        <>
            <Header />
            <main className="min-h-[60vh] font-montserrat flex flex-col items-center justify-center text-center px-4">
                <FaBoxOpen className="text-amber-700 text-6xl mb-4" />
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                    No hay packs disponibles
                </h1>
                <p className="text-gray-600 max-w-md mb-6">
                    Muy pronto tendremos <span className="text-chibi-green font-medium">packs de entrenamientos</span>,  
                    <span className="text-chibi-green font-medium"> dietas</span> y mucho más para ayudarte  
                    a alcanzar tus objetivos de forma rápida y sencilla.
                </p>
                <Link
                    to="/tienda"
                    className="px-6 py-3 bg-chibi-green text-white font-medium rounded-none hover:bg-black transition-colors"
                >
                    Ir a la tienda
                </Link>
            </main>
            <Footer />
        </>
    );
}

export default Packs;
