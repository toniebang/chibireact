// src/App.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProductList from './components/ProductList';
import DailyTrainingSection from './components/DailyTrainingSection';
import TrainerSection from './components/TrainerSection';
import Footer from './components/Footer';
import HorizontalGallery from './components/HorizontalGallery';
import JoinOurTeamSection from './components/JoinOurTeamSection';
import ChibiSkinSection from './components/ChibiSkinSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import CustomerFeedback from './components/CustomerFeedback';
import { useProducts } from './context/ProductContext'; // 👈 usa el contexto
import KoreanProductsBanner from './components/KoreanProductsBanner';
import SectionHeading from './components/SectionHeading';
import BrandBand from './components/BrandBand';
function App() {
  const { products, loading, error } = useProducts(); // 👈 toma los datos reales

  return (
    <div className="font-montserrat">
      <Header />
      <Hero />
      <BrandBand />
      <AboutSection />
      <ServicesSection />

      {/* Home: muestra 4 destacados (ProductList ya corta a 4 cuando isHome=true) */}
      {/* Mundo claro: la tienda */}
      <div className='bg-chibi-bone pt-14 md:pt-28 pb-4 md:pb-10'>
        <div className='max-w-7xl mx-auto px-5 sm:px-6 lg:px-8'>
          <SectionHeading eyebrow={<Link to="/tienda" className='hover:text-chibi-ink transition-colors duration-200'>ChibiShop</Link>}>
            Recién subidos
          </SectionHeading>
        </div>
        <ProductList
          products={products}
          loading={loading}
          error={error}
          isHome={true}
          gridColumns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      </div>

      <KoreanProductsBanner />

      <DailyTrainingSection />
      <ChibiSkinSection />
      <TrainerSection />
      <HorizontalGallery />
      <CustomerFeedback />
      <JoinOurTeamSection />

      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

export default App;
