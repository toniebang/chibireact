import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import BrandBand from '../components/BrandBand';
import { Link } from 'react-router-dom';
import training from '../assets/training.jpg';

const Packs = () => {
    return (
        <>
            <Header />
            <main className="font-montserrat bg-chibi-ink text-white pt-28 md:pt-44 pb-14 md:pb-28">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 md:gap-7">
                        <p className="chibi-eyebrow text-chibi-green flex items-center gap-3.5">
                            <span className="inline-block h-[3px] w-9 md:w-12 bg-chibi-green" aria-hidden="true" />
                            Packs
                        </p>

                        <h1 className="chibi-display leading-[0.84] text-[clamp(3.5rem,18vw,4.75rem)] sm:text-[6.5rem] lg:text-[clamp(6rem,8.6vw,8.25rem)]">
                            No hay packs <span className="text-chibi-green">disponibles</span>
                        </h1>

                        <p className="text-base md:text-lg leading-relaxed text-chibi-mist max-w-md">
                            Muy pronto tendremos <span className="text-white font-semibold">packs de entrenamientos</span>,
                            <span className="text-white font-semibold"> dietas</span> y mucho más para ayudarte
                            a alcanzar tus objetivos de forma rápida y sencilla.
                        </p>

                        <div>
                            <Link to="/tienda" className="chibi-btn chibi-btn-white w-full sm:w-auto">
                                Ir a la tienda
                                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="M13 6l6 6-6 6" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <img
                        src={training}
                        alt="Grupo de entrenamiento Chibi Sport"
                        className="w-full h-[260px] md:h-[480px] object-cover"
                    />
                </div>
            </main>
            <BrandBand />

            <Footer />
        </>
    );
}

export default Packs;
