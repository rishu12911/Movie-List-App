import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const MovieCard = ({ movie }) => {
  return (
    <Grid item xs={6} sm={6} md={3}>
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
          <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: 9 }}>
            {movie.overview}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MovieCard;
