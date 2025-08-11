// src/App.jsx
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProductList from './components/ProductList';
import DailyTrainingSection from './components/DailyTrainingSection';
import Footer from './components/Footer';
import HorizontalGallery from './components/HorizontalGallery';
import JoinOurTeamSection from './components/JoinOurTeamSection';
import ChibiSkinSection from './components/ChibiSkinSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import CustomerFeedback from './components/CustomerFeedback';
import { useProducts } from './context/ProductContext'; // 👈 usa el contexto

function App() {
  const { products, loading, error } = useProducts(); // 👈 toma los datos reales

  return (
    <div className="font-montserrat">
      <Header />
      <Hero />
      <AboutSection />
      <ServicesSection />

      {/* Home: muestra 4 destacados (ProductList ya corta a 4 cuando isHome=true) */}
      <ProductList
        products={products}
        loading={loading}
        error={error}
        isHome={true}
        gridColumns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />

      <DailyTrainingSection />
      <ChibiSkinSection />
      <HorizontalGallery />
      <CustomerFeedback />
      <JoinOurTeamSection />

      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

export default App;
