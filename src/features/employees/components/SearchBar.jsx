import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({
  searchTerm = '',
  onSearchChange,
  onSearch,
  onClear,
  loading = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}
    >
      <TextField
        label="Search by ID"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Enter employee ID..."
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !searchTerm.trim()}
      >
        Search
      </Button>

      {searchTerm ? (
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
          disabled={loading}
        >
          Clear
        </Button>
      ) : null}
    </Box>
  );
};

export default SearchBar;
