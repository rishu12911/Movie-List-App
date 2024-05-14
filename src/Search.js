import React from 'react';
import { TextField } from '@mui/material';

const Search = ({ searchTerm, handleSearchChange }) => {
  return (
    <div className="center-div">
      <TextField type="text" placeholder="Search movies..." value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

export default Search;
