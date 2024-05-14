import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import Search from './Search';
import { apiKey } from './ApiKeys';

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
      if (debouncedSearchTerm.trim()) {
        response = await axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: apiKey,
            query: debouncedSearchTerm,
          },
        });
      } else {
        response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: apiKey,
            page: currentPage,
          },
        });
      }
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <div className="center-div">
        {isLoading && <CircularProgress size={80} />}
      </div>
      <Grid container spacing={2} justifyContent="flex-start">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </Grid>
      {(!searchTerm || searchTerm.trim() === '') ? (
  <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
) : null}
    </div>
  );
};

export default MovieList;
