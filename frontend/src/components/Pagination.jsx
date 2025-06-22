import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Cantidad máxima de números de página a mostrar

  // Lógica para mostrar un rango de páginas alrededor de la página actual
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="flex justify-center space-x-2 mt-8" id="paginador"> {/* equivalente a .post-pagination */}
      {currentPage > 1 && (
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-gray-600 transition-colors duration-200 focus:outline-none"
            aria-label="Página anterior"
          >
            <i className="fa fa-caret-left"></i>
          </button>
        </li>
      )}

      {pageNumbers.map((number) => (
        <li key={number}>
          <button
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 border rounded transition-colors duration-200 focus:outline-none ${
              currentPage === number
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {number}
          </button>
        </li>
      ))}

      {currentPage < totalPages && (
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-gray-600 transition-colors duration-200 focus:outline-none"
            aria-label="Página siguiente"
          >
            <i className="fa fa-caret-right"></i>
          </button>
        </li>
      )}
    </ul>
  );
};

export default Pagination;