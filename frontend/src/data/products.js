// src/data/products.js

const products = [
  {
    id: 1,
    imagen1: 'https://www.bodybuildinglatino.com/wp-content/uploads/2019/10/bcaa-6000-fruit-punch-nutrex-600x600.png.jpg', // URL de la imagen
    nombre: 'Proteína Whey Isolate Avanzada',
    precio: 2400,
    oferta: true,
    precio_rebaja: 39.99,
    categorias: ['Suplementos', 'Proteínas'],
    is_new: true, // Nuevo
  },
  {
    id: 2,
    imagen1: 'https://media.falabella.com/falabellaCO/137885578_01/w=800,h=800,fit=pad',
    nombre: 'Creatina Monohidratada Pura',
    precio: 25000.00,
    oferta: false,
    precio_rebaja: null,
    categorias: ['Suplementos', 'Rendimiento'],
    is_new: false,
  },
  {
    id: 3,
    imagen1: 'https://www.amway.com.do/medias/120011DR-es-DO-690px-01?context=bWFzdGVyfGltYWdlc3w2NzA0M3xpbWFnZS9wbmd8c3lzLW1hc3Rlci9pbWFnZXMvaDQ5L2hjYi85Nzc3MTIyNjM5OTAyLzEyMDAxMURSLWVzLURPLTY5MHB4LTAxfDY2M2VlMDFhZTY5ZjAwY2E1ZTA4YmYyNzk2Mzg0MjY3MDI5OWZkYTA4MTMxZjFkNWI2NTM5OWU4NjI0NTVjMjI',
    nombre: 'Multivitamínico Diario',
    precio: 1875,
    oferta: false,
    precio_rebaja: null,
    categorias: ['Vitaminas', 'Bienestar'],
    is_new: true,
  },
  {
    id: 4,
    imagen1: 'https://acdn-us.mitiendanube.com/stores/583/512/products/coco-y-dulce-3c79736c4c440cc34217170804222191-1024-1024.jpg',
    nombre: 'Barritas Proteicas Sabor Chocolate',
    precio: 25000,
    oferta: true,
    precio_rebaja: 199,
    categorias: ['Snacks', 'Proteínas'],
    is_new: false,
  },
  // Añadidos algunos productos más para probar mejor el grid
  {
    id: 5,
    imagen1: 'https://farmaciacarlotatorres.com/cosmetica-farmacia/aminoacidos.png',
    nombre: 'Aminoácidos BCAA Esenciales',
    precio: 3000,
    oferta: false,
    precio_rebaja: null,
    categorias: ['Suplementos', 'Recuperación'],
    is_new: true,
  },
  {
    id: 6,
    imagen1: 'https://goldnutrition.pt/wp-content/uploads/2018/08/Pre-Workout-Explosive-GoldNutrition-Pre-entreno-explosivo.jpg',
    nombre: 'Pre-Entreno Explosivo',
    precio: 3999,
    oferta: false,
    precio_rebaja: null,
    categorias: ['Suplementos', 'Energía'],
    is_new: false,
  },
  {
    id: 7,
    imagen1: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/oga/oga00780/y/8.jpg',
    nombre: 'Proteína Vegana Orgánica',
    precio: 4500,
    oferta: true,
    precio_rebaja: 3999,
    categorias: ['Suplementos', 'Vegano'],
    is_new: true,
  },
  {
    id: 8,
    imagen1: 'https://suplementoshsd.com/cdn/shop/files/omegaplatinum.jpg?v=1729464265&width=1080',
    nombre: 'Omega-3 de Alta Pureza',
    precio: 2500,
    oferta: false,
    precio_rebaja: null,
    categorias: ['Suplementos', 'Salud'],
    is_new: false,
  },
];

export default products;