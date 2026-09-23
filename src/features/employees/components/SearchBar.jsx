import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({ searchTerm = '', onSearchChange, onClear }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
      <TextField
        label="Search by ID"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {searchTerm ? (
        <Button variant="outlined" color="secondary" onClick={onClear}>
          Clear
        </Button>
      ) : null}
    </Box>
  );
};

export default SearchBar;
