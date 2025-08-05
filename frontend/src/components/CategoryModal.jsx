// src/components/CategoryModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos tu hook useAuth

const CategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
    const { authAxios } = useAuth(); // Obtenemos la instancia authAxios
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Usa authAxios para la petición POST
            await authAxios.post('/categorias/', { nombre });
            
            onCategoryAdded(); // Llama a la función del padre para refrescar las categorías
            
            setNombre('');
            onClose(); // Cierra el modal
        } catch (err) {
            console.error('Error al crear la categoría:', err.response?.data || err.message || err);
            setError('No se pudo crear la categoría. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-md shadow-lg">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">Crear Nueva Categoría</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre de la Categoría
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;