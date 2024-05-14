import React from 'react';
import { Button } from '@mui/material';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const generateVisiblePages = () => {
    const visiblePageRange = 5;
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (startPage < 1) {
      startPage = 1;
      endPage = visiblePageRange;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePageRange + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="center-div">
      <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      {generateVisiblePages().map((page) => (
        <Button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
          {page}
        </Button>
      ))}
      <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
};

export default Pagination;
