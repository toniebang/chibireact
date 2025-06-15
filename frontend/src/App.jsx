import React from 'react'; // 'useState' ya no es necesario aquí
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProductList from './components/ProductList';
import products from './data/products';
import DailyTrainingSection from './components/DailyTrainingSection';
import Footer from './components/Footer';
import HorizontalGallery from './components/HorizontalGallery';
import JoinOurTeamSection from './components/JoinOurTeamSection';
import ChibiSkinSection from './components/ChibiSkinSection';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {

  return (
    <div className='font-montserrat'>
      <Header />
      <Hero />
      <AboutSection />
      <ServicesSection />
      
  
      <ProductList 
        products={products} 
        isHome={true} 
      />

      <DailyTrainingSection />
      <ChibiSkinSection />
      <HorizontalGallery />
      <JoinOurTeamSection />
      
      
    <ScrollToTopButton />
      <Footer></Footer>

    </div>
  );
}

export default App;