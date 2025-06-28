import React from 'react';
import banner from '../assets/join-now-bg.jpg'; // Asegúrate de que la ruta sea correcta
import strip from '../assets/strip.png'; // Asegúrate de que la ruta sea correcta
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Banner = ({ page_title }) => {
    return (
        <div>
        <div className='bg-cover  bg-center p-10 mt-10' style={{ backgroundImage: `url(${banner})` }}>
            <h1 className='text-3xl font-bold text-white text-center'>{page_title}</h1>
            <p className='text-white font-light text-center'>Ofrecemos servicios de Fitness y salud desde 2021</p>
        </div>

        <div 
         className="bg-white bg-repeat text-center border-b border-[#F7F7F7]"
        style={{ backgroundImage: `url(${strip})` }}>
            <Link to='/' className='text-[16px] text-[#9e9e9e] font-light'>Inicio - </Link>   <a className='text-[16px] text-chibi-green font-light '> {page_title.toLowerCase()}</a>
        </div>

        </div>
    );
}

export default Banner;
