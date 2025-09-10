// src/components/ProductsManagementList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';
import CreateProductForm from './CreateProductForm';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const PRODUCTS_PER_PAGE = 10;

const lineLabel = (v) => {
  if (v === 'skin') return 'Chibi Skin';
  if (v === 'tea') return 'Chibi Tea';
  return 'Todos';
};

const ProductsManagementList = () => {
  const { authAxios, user, isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // paginación local
  const [currentPage, setCurrentPage] = useState(1);

  // ---- ORDENACIÓN ----
  // sortField: 'name' | 'price' | 'date' | null
  const [sortField, setSortField] = useState(null);
  // sortDir: 'asc' | 'desc'
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    setCurrentPage(1);
    if (sortField !== field) {
      setSortField(field);
      // Primer clic: nombre asc, precio asc, fecha desc (nuevo→viejo)
      if (field === 'date') setSortDir('desc');
      else setSortDir('asc');
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    }
  };

  const fetchProducts = async () => {
    if (!isAuthenticated || !user?.is_superuser) return;
    setLoadingProducts(true);
    setError('');
    try {
      // Trae más filas para que la paginación local sea útil
      const response = await authAxios.get('/productos/', {
        params: { page_size: 200, ordering: '-fecha_subida' },
      });
      const list = response.data?.results ?? [];
      setProducts(list);
      setCurrentPage(1);
    } catch (err) {
      setError('Error cargando productos.');
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Optimización: precomputar timestamp y precio normalizado una sola vez
  const productsWithComputed = useMemo(() => {
    return (products || []).map((p) => ({
      ...p,
      _ts: p?.fecha_subida ? Date.parse(p.fecha_subida) || 0 : 0,
      _price: Number(p?.precio) || 0,
    }));
  }, [products]);

  // Aplica ordenación local
  const sortedProducts = useMemo(() => {
    if (!sortField) return productsWithComputed;
    const arr = [...productsWithComputed];
    arr.sort((a, b) => {
      if (sortField === 'name') {
        const an = (a?.nombre ?? '').toString();
        const bn = (b?.nombre ?? '').toString();
        const cmp = an.localeCompare(bn, 'es', { sensitivity: 'base' });
        return sortDir === 'asc' ? cmp : -cmp; // asc: A→Z, desc: Z→A
      }
      if (sortField === 'price') {
        const cmp = a._price - b._price; // asc: menor→mayor
        return sortDir === 'asc' ? cmp : -cmp; // desc: mayor→menor
      }
      if (sortField === 'date') {
        const cmp = a._ts - b._ts; // asc: viejo→nuevo
        return sortDir === 'asc' ? cmp : -cmp; // desc: nuevo→viejo
      }
      return 0;
    });
    return arr;
  }, [productsWithComputed, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil((sortedProducts.length || 0) / PRODUCTS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
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
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="inline-block opacity-60" />;
    return sortDir === 'asc' ? (
      <FaSortUp className="inline-block" />
    ) : (
      <FaSortDown className="inline-block" />
    );
  };

  const thActive = (field) =>
    sortField === field ? 'text-chibi-green' : 'text-gray-800';

  const ariaSort = (field) => {
    if (sortField !== field) return 'none';
    return sortDir === 'asc' ? 'ascending' : 'descending';
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
          className="bg-chibi-green px-4 py-2 text-white font-semibold hover:bg-chibi-dark-green rounded-none"
        >
          Agregar Producto
        </button>
      </div>

      {loadingProducts && <p>Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loadingProducts && !error && (
        <>
          {/* Table wrapper para scroll horizontal en móvil */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-[720px] w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border border-gray-300" aria-sort={ariaSort('name')}>
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className={`inline-flex items-center gap-1 hover:underline ${thActive('name')}`}
                      title="Ordenar por Nombre (clic para alternar A→Z / Z→A)"
                    >
                      Nombre <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="p-2 border border-gray-300" aria-sort={ariaSort('price')}>
                    <button
                      type="button"
                      onClick={() => toggleSort('price')}
                      className={`inline-flex items-center gap-1 hover:underline ${thActive('price')}`}
                      title="Ordenar por Precio (clic para alternar menor→mayor / mayor→menor)"
                    >
                      Precio (XAF) <SortIcon field="price" />
                    </button>
                  </th>
                  <th className="p-2 border border-gray-300">Precio Rebaja</th>
                  <th className="p-2 border border-gray-300" aria-sort={ariaSort('date')}>
                    <button
                      type="button"
                      onClick={() => toggleSort('date')}
                      className={`inline-flex items-center gap-1 hover:underline ${thActive('date')}`}
                      title="Ordenar por Fecha de Subida (clic para alternar nuevo→viejo / viejo→nuevo)"
                    >
                      Fecha de Subida <SortIcon field="date" />
                    </button>
                  </th>
                  <th className="p-2 border border-gray-300">Línea</th>
                  <th className="p-2 border border-gray-300">Publicado</th>
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
                  const publicado = !!product.disponible;

                  return (
                    <tr
                      key={product.id}
                      className="border border-gray-300 hover:bg-gray-50 align-middle"
                    >
                      <td className="p-2 border border-gray-300">{product.nombre}</td>
                      <td className="p-2 border border-gray-300">{product.precio}</td>
                      <td className="p-2 border border-gray-300">
                        {product.oferta ? product.precio_rebaja : 'N/A'}
                      </td>
                      <td className="p-2 border border-gray-300">{fecha}</td>

                      {/* Línea */}
                      <td className="p-2 border border-gray-300">
                        {product.linea ? (
                          <span className="px-2 py-0.5 text-xs rounded-full border border-chibi-green text-chibi-green bg-chibi-green/10">
                            {lineLabel(product.linea)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      {/* Publicado */}
                      <td className="p-2 border border-gray-300">
                        {publicado ? (
                          <span className="text-green-700 text-xs font-medium">Sí</span>
                        ) : (
                          <span className="text-gray-500 text-xs">No</span>
                        )}
                      </td>

                      {/* Imágenes */}
                      <td className="p-2 border border-gray-300">
                        <div className="flex gap-2">
                          {[product.imagen1, product.imagen2, product.imagen3].map(
                            (img, idx) =>
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

                      {/* Acciones */}
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
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={8}>
                      No hay productos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4 flex justify-center flex-wrap gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded-none disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
