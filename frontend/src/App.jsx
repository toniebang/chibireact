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
import PromoBanner from './components/PromoBanner';
function App() {
  const { products, loading, error } = useProducts(); // 👈 toma los datos reales

  return (
    <div className="font-montserrat">
      <Header />
      <Hero />
      <AboutSection />
      <ServicesSection />

      {/* Home: muestra 4 destacados (ProductList ya corta a 4 cuando isHome=true) */}
      <div className='max-w-7xl mx-auto px-4 text-xl font-light sm:px-6 lg:px-8'>
        <p>PRODUCTOS RECIÉN SUBIDOS EN <Link to="/tienda" className=' text-chibi-green hover:text-chibi-green-dark'>CHIBISHOP</Link></p>
      </div>
      <ProductList
        products={products}
        loading={loading}
        error={error}
        isHome={true}
        gridColumns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />

      <PromoBanner />

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
