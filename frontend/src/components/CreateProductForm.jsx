// src/components/CreateProductForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import CategoryModal from './CategoryModal';

const LINEA_OPTIONS = [ // NEW
  { value: 'skin', label: 'Chibi Skin' },
  { value: 'tea',  label: 'Chibi Tea'  },
  { value: 'todo', label: 'Todos'      },
];

const CreateProductForm = ({
  onClose,
  productToEdit = null,
  onSaveSuccess,
  externalButtons = false,
  formId = 'product-form',
}) => {
  const { authAxios, user, isAuthenticated, loading: authLoading } = useAuth();

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
    linea: 'todo', // NEW
  });

  // Previews en vivo
  const [previews, setPreviews] = useState({
    imagen1: '',
    imagen2: '',
    imagen3: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [message, setMessage]       = useState('');
  const [error, setError]           = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const fetchCategorias = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await authAxios.get(`/categorias/`);
      setCategorias(response.data.results);
    } catch (err) {
      console.error("Error al cargar las categorías:", err.response?.data || err.message || err);
      setError("Error al cargar categorías.");
    }
  }, [authAxios, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchCategorias();
  }, [fetchCategorias, isAuthenticated]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        descripcion: productToEdit.descripcion || '',
        precio: productToEdit.precio || 0,
        oferta: !!productToEdit.oferta,
        precio_rebaja: productToEdit.precio_rebaja || 0,
        disponible: productToEdit.disponible ?? true,
        stock: productToEdit.stock ?? true,
        prioridad: productToEdit.prioridad || 1,
        lista_caracteristicas: productToEdit.lista_caracteristicas || '',
        categoria: productToEdit.categoria ? productToEdit.categoria.map(c => c.id || c) : [],
        imagen1: null,
        imagen2: null,
        imagen3: null,
        linea: productToEdit.linea || 'todo', // NEW
      });
      setMessage('');
      setError('');

      // Previews iniciales con imágenes existentes
      setPreviews({
        imagen1: productToEdit.imagen1 || '',
        imagen2: productToEdit.imagen2 || '',
        imagen3: productToEdit.imagen3 || '',
      });
    } else {
      setPreviews({ imagen1: '', imagen2: '', imagen3: '' });
    }
  }, [productToEdit]);

  // Limpiar object URLs al desmontar
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value, type, checked, files, options } = e.target;

    if (type === 'file') {
      const file = files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviews(prev => {
          // limpia anterior si era blob
          if (prev[name]?.startsWith('blob:')) URL.revokeObjectURL(prev[name]);
          return { ...prev, [name]: url };
        });
      }
      return;
    }

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'categoria') {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, categoria: selected }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // NEW: validaciones rápidas
    if (formData.oferta) {
      const p = Number(formData.precio) || 0;
      const r = Number(formData.precio_rebaja) || 0;
      if (r <= 0 || r >= p) {
        setLoading(false);
        setError('El precio de oferta debe ser mayor que 0 y menor que el precio.');
        return;
      }
    }
    // Asegurar que línea es válida
    if (!['skin', 'tea', 'todo'].includes(formData.linea)) {
      setLoading(false);
      setError('Selecciona una línea válida.');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key === 'precio_rebaja' && !formData.oferta) continue;

      if (key === 'categoria') {
        formData.categoria.forEach(id => data.append('categoria', id));
      } else if (['imagen1', 'imagen2', 'imagen3'].includes(key)) {
        if (formData[key]) data.append(key, formData[key]); // solo si hay nueva
      } else if (key === 'lista_caracteristicas') {
        data.append(key, (formData.lista_caracteristicas || '').trim() || 'N/A');
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      let res;
      if (productToEdit?.id) {
        res = await authAxios.patch(`/productos/${productToEdit.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('¡Producto actualizado con éxito!');
      } else {
        res = await authAxios.post(`/productos/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('¡Producto creado con éxito!');
      }

      onSaveSuccess?.(res.data);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError('Error al subir/editar el producto. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Cargando...</p>;
  if (!isAuthenticated || !user?.is_superuser) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
        <p className="font-semibold">Acceso denegado.</p>
        <p>Solo los superadministradores pueden gestionar productos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {productToEdit ? 'Editar Producto' : 'Subir Nuevo Producto'}
      </h2>

      {message && <p className="text-green-600 font-semibold">{message}</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
        {/* 👇 IMÁGENES: ARRIBA Y PROTAGONISTAS */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Imágenes del producto</p>
          <div className="grid grid-cols-3 gap-3">
            {['imagen1', 'imagen2', 'imagen3'].map((key, idx) => (
              <div key={key} className="flex flex-col items-start gap-2">
                <div className="w-full aspect-square border border-gray-300 overflow-hidden">
                  {previews[key] ? (
                    <img src={previews[key]} alt={`Preview ${key}`} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <label className="block text-xs text-gray-600">{`Imagen ${idx + 1}`}</label>

                {/* 👇 Botón custom */}
                <label
                  htmlFor={`${key}-input`}
                  className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-none cursor-pointer hover:bg-gray-200"
                >
                  Elegir imagen
                </label>
                <input
                  id={`${key}-input`}
                  type="file"
                  name={key}
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  {...(!productToEdit && key === 'imagen1' ? { required: true } : {})}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Campos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-none shadow-sm p-2.5 focus:ring-chibi-green focus:border-chibi-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (XAF)</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-none shadow-sm p-2.5 focus:ring-chibi-green focus:border-chibi-green"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="oferta"
              checked={formData.oferta}
              onChange={handleChange}
              className="focus:ring-chibi-green h-4 w-4 text-chibi-green border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Poner en descuento</label>
          </div>

          {formData.oferta && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio de Oferta (XAF)</label>
              <input
                type="number"
                name="precio_rebaja"
                value={formData.precio_rebaja}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-none shadow-sm p-2.5 focus:ring-chibi-green focus:border-chibi-green"
              />
            </div>
          )}

          {/* NEW: Línea de producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Línea de producto</label>
            <select
              name="linea"
              value={formData.linea}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-none shadow-sm p-2.5 bg-white focus:ring-chibi-green focus:border-chibi-green"
              required
            >
              {LINEA_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* NEW: Publicar (disponible) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Publicar</span>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-checked:bg-chibi-green relative rounded-full transition-colors
                              after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white
                              after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* NEW: En stock */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">En stock</span>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                name="stock"
                checked={formData.stock}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-checked:bg-chibi-green relative rounded-full transition-colors
                              after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white
                              after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        {/* Categorías */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Categorías (Ctrl/Cmd para seleccionar varias)</label>
            <button
              type="button"
              onClick={() => setIsCatModalOpen(true)}
              className="bg-green-500 text-white text-xs py-1 px-3 rounded-none hover:bg-green-600"
            >
              + Nueva Categoría
            </button>
          </div>
          <select
            multiple
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-none shadow-sm p-2.5 focus:ring-chibi-green focus:border-chibi-green"
          >
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ej: Gel limpiador suave con aloe y niacinamida. Remueve impurezas sin resecar y calma rojeces. Apto para piel sensible."
            className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:ring-2 focus:ring-chibi-green focus:outline-none"
            rows={4}
          />
        </div>

        {/* Lista de características */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lista de características</label>
          <textarea
            name="lista_caracteristicas"
            value={formData.lista_caracteristicas}
            onChange={handleChange}
            placeholder="Ej: color: rojo, tamaño: mediano (separa por comas)"
            className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:ring-2 focus:ring-chibi-green focus:outline-none"
            rows={4}
          />
        </div>

        {/* Botonera interna (solo si no usamos footer del modal) */}
        {!externalButtons && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-none hover:bg-gray-300 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-chibi-green text-white font-semibold py-2 px-6 rounded-none shadow hover:bg-chibi-green-dark disabled:opacity-60"
            >
              {loading ? (productToEdit ? 'Actualizando...' : 'Subiendo...') : (productToEdit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        )}
      </form>

      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onCategoryAdded={fetchCategorias}
      />
    </div>
  );
};

export default CreateProductForm;
