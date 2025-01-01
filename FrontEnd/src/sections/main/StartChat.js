import { Dialog, DialogContent, DialogTitle, Slide, Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass } from 'phosphor-react';
import ChatElement from '../../components/ChatElement';
import { useSearchUsersQuery } from '../auth/services/RegisterForm.slice'; // Import useSearchUsersQuery

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartChat = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced search query

  // Fetch users based on the debounced query
  const { data: searchResults, isLoading, isError } = useSearchUsersQuery(debouncedQuery);

  // Debouncing mechanism to avoid excessive API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after delay
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timeout); // Clean up timeout on query change
  }, [searchQuery]); // Only run when searchQuery changes

  // Handling the search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Ensure searchResults is an array
  const users = Array.isArray(searchResults?.users) ? searchResults.users : [];

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
      onClose={handleClose}
    >
      <DialogTitle sx={{ mb: 3 }}>Start Chat</DialogTitle>
      <DialogContent>
        {/* Search Input */}
        <Stack spacing={3}>
          <Stack sx={{ width: '100%' }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange} // Update search query on input change
              />
            </Search>
          </Stack>
        </Stack>

        {/* Loading State */}
        {isLoading && <Typography>Loading...</Typography>}

        {/* Error State */}
        {isError && <Typography color="error">An error occurred while fetching users.</Typography>}

        {/* Filtered Chat List */}
        {searchQuery && users.length === 0 && (
          <Typography variant="subtitle2" sx={{ color: '#676767' }}>
            No users found
          </Typography>
        )}

        {/* Display search results */}
        {users.map((user) => (
          <ChatElement
            key={user._id} // Ensure each ChatElement has a unique key
            id={user._id}
            username={user.username} // Passing username to ChatElement
            profilePicture={user.profilePicture.url} // Passing profilePicture URL to ChatElement
            online={user.isActive} // Use `isActive` or any other relevant field for online status
      
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default StartChat;
