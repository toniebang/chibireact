import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Banner from '../components/Banner';
import AboutSection from '../components/AboutSectionForPage';
import OurTeam from '../components/OurTeam';
import ContactInfo from '../components/ContactInfo';

const About = () => {
    return (
        <div className='font-montserrat'>
            <Header />
            <Banner page_title='ACERCA DE NOSOTROS' />
         <AboutSection />
            <OurTeam />
            <ContactInfo />
            <Footer />
        </div>
    );
}

export default About;
