import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, debouncedSearchTerm]);

  const fetchMovies = async () => {
    setIsLoading(true); 
    try {
      let response;
      if (debouncedSearchTerm) {
        response = await axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '3d4474c017ac755e9c059b001cf39ff0',
            page: currentPage,
            query: debouncedSearchTerm
          }
        });
      } else {
        response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: '3d4474c017ac755e9c059b001cf39ff0',
            page: currentPage
          }
        });
      }
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }
  };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Movies List</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {isLoading && <div>Loading...</div>} {/* Display loading spinner */}
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <div>
              <h2>{movie.title}</h2>
              {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />}
              <p>{movie.overview}</p>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {generateVisiblePages().map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
