import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';

const ProductDetail = () => {
    return (
        <div>
            <Header />
            <Banner page_title={'DETALLES DEL PRODUCTO'} />
            <div className='h-[500px]'>

            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;
