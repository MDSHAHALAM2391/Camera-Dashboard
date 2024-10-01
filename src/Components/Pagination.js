import React from "react";
import "../styles/Pagination.css";
function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="pagination-controls">
      <button onClick={handleFirst} disabled={currentPage === 1}>
        «
      </button>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        ‹
      </button>
      <span className="pagination-current-page">{currentPage}</span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        ›
      </button>
      <button onClick={handleLast} disabled={currentPage === totalPages}>
        »
      </button>
    </div>
  );
}

export default Pagination;
