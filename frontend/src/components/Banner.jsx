import React from 'react';
import banner from '../assets/join-now-bg.jpg'; // Asegúrate de que la ruta sea correcta

const Banner = ({ page_title }) => {
    return (
        <div>
        <div className='bg-cover  bg-center p-9 mt-13' style={{ backgroundImage: `url(${banner})` }}>
            <h1 className='text-3xl font-bold text-white text-center'>{page_title}</h1>
            <p className='text-white font-light text-center'>Ofrecemos servicios de Fitness y salud desde 2021</p>
        </div>

        <div>
            Inicio
        </div>

        </div>
    );
}

export default Banner;
