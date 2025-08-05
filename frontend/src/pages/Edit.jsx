import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CreateProductForm from '../components/CreateProductForm';

const Edit = () => {
    return (
        <div>
            <Header />
            <CreateProductForm />
            <Footer />
        </div>
    );
}

export default Edit;
