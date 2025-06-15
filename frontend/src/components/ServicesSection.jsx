import React from 'react';

// Asegúrate de que las rutas a tus imágenes sean correctas
import offerProducts1 from '../assets/offer-products-1.jpg';
import offerProducts22 from '../assets/offer-products-2.jpg';
import offerProducts3 from '../assets/offer-products-3.jpg';
import offerProducts4 from '../assets/offer-products-4.jpg';

// Nueva importación de la imagen 'tile'
import tile from '../assets/bg-2.png';

const services = [
  {
    id: 'entrenamiento',
    title: 'Entrenamiento al aire libre',
    image: offerProducts1,
    alt: 'Imagen de entrenamiento al aire libre', // Mejorar el alt text
  },
  {
    id: 'dietas',
    title: 'Dietas Personalizadas',
    image: offerProducts22,
    alt: 'Imagen de dietas personalizadas', // Mejorar el alt text
  },
  {
    id: 'tes',
    title: 'Tés 100% naturales',
    image: offerProducts3,
    alt: 'Imagen de tés 100% naturales', // Mejorar el alt text
  },
  {
    id: 'skincare',
    title: 'Productos Skin Care',
    image: offerProducts4,
    alt: 'Imagen de productos Skin Care', // Mejorar el alt text
  },
];

const ServicesSection = () => {
  return (
    <section className="shop-cta py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className='text-xl font-light'>NUESTROS SERVICIOS</h1>
          <img src={tile} alt="Descripción de la imagen decorativa" /> {/* Asegúrate de que el alt text sea apropiado */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service) => (
            <a 
              key={service.id}
              href="#" 
              data-toggle="modal" 
              data-target={`#${service.id}`} 
              className="single-shop-cta block relative overflow-hidden shadow-lg group cursor-pointer 
                         transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="img-holder-2 relative h-64"> {/* h-64 para una altura fija de la tarjeta */}
                <img 
                  src={service.image} 
                  alt={service.alt} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                /> 
                
                <div className="absolute inset-x-0 bottom-0 p-4 
                                bg-gradient-to-t from-black/90 to-transparent 
                                text-white flex items-end"> {/* 'flex items-end' para alinear el texto al final si hubiera espacio */}
                  <h3 className="text-xl font-semibold leading-tight">{service.title}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;