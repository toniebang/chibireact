import React from 'react';
// This is the main App component that serves as the entry point for the application.
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUsSection from './components/AboutSection';

function App() {
  return (
  //   <div className='bg-blue-500  text-white p-4'>
  //  componentes <br />
  //  ------------------------
  //   <ul>
  //     <li>header</li>
  //     <li> hero</li>
  //     <li>perfect seccion </li>
  //     <li>training seciton</li>
  //     <li>training articles</li>
  //     <li>footer</li>
  //     <li>card</li>
  //     <li>card filter</li>
  //   </ul>
  //   poages <br />
  //   ------------------------
  //   <ul>
  //     <li>home</li>
  //     <li>about</li>
  //     <li>contact</li>
  //     <li>blog</li>
  //     <li>packs</li>
  //     <li>register</li>
  //     <li>tienda</li>
  //     <li>profile</li>
  //     <li>404</li>
  //     <li>login</li>
  //     <li>producto</li>
  //     <li>carrito</li>
  //     <li>carrito</li>

  //   </ul>
  //   </div>

  <div>
    <Header></Header>
    <Hero></Hero>
    <AboutUsSection></AboutUsSection>
  </div>
  );
}

export default App;