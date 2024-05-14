import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';

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
            api_key: '3d4474c017ac755e9c059b001cf39ff0',
            query: debouncedSearchTerm,
          },
        });
      } else {
        response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: '3d4474c017ac755e9c059b001cf39ff0',
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
      <div className="center-div">
        <TextField type="text" placeholder="Search movies..." value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className="center-div">
      {isLoading && <CircularProgress size={80}/>}
      </div>
      <Grid container spacing={2} justifyContent="flex-start">
        {movies.map((movie, index) => (
          <Grid key={index} item xs={6} sm={6} md={3}>
            <Card style={{ height: '100%', marginBottom: '10px', backgroundColor: '#EBEBEBAA', color: '#fff', boxShadow: '5px 5px 5px lightblue' }}>
              <CardMedia
                component="img"
                alt={movie.title}
                height="300"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />
              <CardContent style={{ maxHeight: '100px', overflow: 'hidden' }}>
                <Typography style={{ color: 'black' }} gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:9}}>
                  {movie.overview}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
    </div>
  );
};

export default MovieList;
