// src/components/CreateProductForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos tu hook useAuth
import CategoryModal from './CategoryModal';

const CreateProductForm = () => {
    const { authAxios, user, isAuthenticated, loading: authLoading } = useAuth(); // Obtenemos las utilidades del contexto

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        oferta: false,
        precio_rebaja: 0,
        disponible: true,
        stock: true,
        prioridad: 1,
        lista_caracteristicas: '',
        categoria: [],
        imagen1: null,
        imagen2: null,
        imagen3: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCategorias = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            // Usa authAxios para todas las peticiones a la API
            const response = await authAxios.get(`/categorias/`); 
            setCategorias(response.data.results); 
        } catch (err) {
            console.error("Error al cargar las categorías:", err.response?.data || err.message || err);
            setError("Error al cargar categorías.");
        }
    }, [authAxios, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCategorias();
        }
    }, [fetchCategorias, isAuthenticated]);

    const handleChange = (e) => {
        const { name, value, type, checked, files, options } = e.target;
        
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'categoria') {
            const selectedOptions = Array.from(options).filter(option => option.selected);
            const selectedCategories = selectedOptions.map(option => option.value);
            setFormData({ ...formData, [name]: selectedCategories });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const data = new FormData();
        for (const key in formData) {
            if (key === 'precio_rebaja' && !formData.oferta) {
                continue;
            }
            if (key === 'categoria') {
                formData.categoria.forEach(id => data.append('categoria', id));
            } else {
                data.append(key, formData[key]);
            }
        }
        
        try {
            // Usa authAxios para la petición POST
            const response = await authAxios.post(`/productos/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('¡Producto subido con éxito!');
            console.log('Respuesta de la API:', response.data);
            setFormData({
                nombre: '', descripcion: '', precio: 0, oferta: false, precio_rebaja: 0,
                disponible: true, stock: true, prioridad: 1, lista_caracteristicas: '',
                categoria: [], imagen1: null, imagen2: null, imagen3: null,
            });
        } catch (err) {
            console.error('Error al subir el producto:', err.response?.data || err.message || err);
            setError('Error al subir el producto. Por favor, revisa la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <p>Cargando...</p>;
    }

    if (!isAuthenticated || !user?.is_superuser) {
        return (
            <div className="max-w-3xl mx-auto mt-15 p-6 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg shadow-lg">
                <p className="font-semibold">Acceso denegado.</p>
                <p>Solo los superadministradores pueden subir productos.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mt-15 mx-auto p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Subir Nuevo Producto</h2>
            {message && <p className="text-green-600 mb-4 font-semibold">{message}</p>}
            {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio (XAF)</label>
                        <input type="number" name="precio" value={formData.precio} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="oferta" checked={formData.oferta} onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label className="text-sm font-medium text-gray-700">En oferta</label>
                    </div>

                    {formData.oferta && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio de Oferta (XAF)</label>
                            <input type="number" name="precio_rebaja" value={formData.precio_rebaja} onChange={handleChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Categorías (Ctrl/Cmd para seleccionar varias)</label>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-500 text-white text-xs py-1 px-3 rounded-md hover:bg-green-600"
                        >
                            + Nueva Categoría
                        </button>
                    </div>
                    <select multiple name="categoria" value={formData.categoria} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500">
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción del producto</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lista de Detalles (separados por comas)</label>
                    <textarea name="lista_caracteristicas" value={formData.lista_caracteristicas} onChange={handleChange} rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen 1</label>
                        <input type="file" name="imagen1" onChange={handleChange} required
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen 2</label>
                        <input type="file" name="imagen2" onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen 3</label>
                        <input type="file" name="imagen3" onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button type="submit" disabled={loading}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {loading ? 'Subiendo...' : 'Subir Producto'}
                    </button>
                </div>
            </form>

            <CategoryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryAdded={fetchCategorias}
            />
        </div>
    );
};

export default CreateProductForm;