import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import CreateProductForm from './CreateProductForm';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ProductsManagementList = () => {
  const { authAxios, user, isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  const fetchProducts = async () => {
    if (!isAuthenticated || !user?.is_superuser) return;
    setLoadingProducts(true);
    setError('');
    try {
      const response = await authAxios.get('/productos/');
      setProducts(response.data.results);
    } catch (err) {
      setError('Error cargando productos.');
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated, user]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await authAxios.delete(`/productos/${productId}/`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  if (!isAuthenticated || !user?.is_superuser) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg shadow-lg">
        <p className="font-semibold">Acceso denegado.</p>
        <p>Solo los superadministradores pueden gestionar productos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Productos</h2>
        <button
          onClick={openCreateModal}
          className="bg-chibi-green px-4 py-2 text-white font-semibold hover:bg-chibi-green-dark rounded-none"
        >
          Agregar Producto
        </button>
      </div>

      {loadingProducts && <p>Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loadingProducts && !error && (
        <>
          <table className="min-w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">Nombre</th>
                <th className="p-2 border border-gray-300">Precio (XAF)</th>
                <th className="p-2 border border-gray-300">Precio Rebaja</th>
                <th className="p-2 border border-gray-300">Fecha de Subida</th>
                <th className="p-2 border border-gray-300">Imágenes</th>
                <th className="p-2 border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const fecha = product.fecha_subida
                  ? new Date(product.fecha_subida).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'N/A';
                return (
                  <tr key={product.id} className="border border-gray-300 hover:bg-gray-50 align-middle">
                    <td className="p-2 border border-gray-300">{product.nombre}</td>
                    <td className="p-2 border border-gray-300">{product.precio}</td>
                    <td className="p-2 border border-gray-300">
                      {product.oferta ? product.precio_rebaja : 'N/A'}
                    </td>
                    <td className="p-2 border border-gray-300">{fecha}</td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex gap-2">
                        {[product.imagen1, product.imagen2, product.imagen3].map((img, idx) =>
                          img ? (
                            <a
                              key={idx}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-12 h-12 border border-gray-300 overflow-hidden"
                              title={`Imagen ${idx + 1}`}
                            >
                              <img
                                src={img}
                                alt={`Producto ${product.nombre} imagen ${idx + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </a>
                          ) : (
                            <div
                              key={idx}
                              className="w-12 h-12 border border-gray-300 flex items-center justify-center text-[10px] text-gray-400"
                            >
                              No Img
                            </div>
                          )
                        )}
                      </div>
                    </td>
                    <td className="p-2 border border-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-blue-600 text-white p-2 rounded-none hover:bg-blue-700 flex items-center justify-center"
                          title="Editar producto"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 text-white p-2 rounded-none hover:bg-red-700 flex items-center justify-center"
                          title="Eliminar producto"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="mt-4 flex justify-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded-none disabled:opacity-50"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-none ${
                  currentPage === i + 1 ? 'bg-chibi-green text-white' : 'bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded-none disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {modalOpen && (
        <Modal onClose={closeModal}>
          <CreateProductForm
            productToEdit={editingProduct}
            onClose={closeModal}
            onSaveSuccess={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductsManagementList;
