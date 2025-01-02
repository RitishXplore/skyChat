import { Dialog, DialogContent, DialogTitle, Slide, Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass } from 'phosphor-react';
import ChatElement from '../../components/ChatElement';
import { useSearchUsersQuery, useStartChatMutation } from '../auth/services/RegisterForm.slice'; // Import useSearchUsersQuery
import Cookies from "js-cookie";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartChat = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced search query
  const [searchResults, setSearchResults] = useState([]); // To manage the search results
  const currentUserId = Cookies.get("userId"); // Assuming 'userId' is stored in the cookie
  console.log(currentUserId);
  const [selectedUserId , setselectedUserId] = useState(null); 
  
  // Fetch users based on the debounced query
  const { data, isLoading, isError } = useSearchUsersQuery(debouncedQuery, {
    skip: !debouncedQuery, // Skip the query if debouncedQuery is empty
  });

  const [startchatdata] = useStartChatMutation();

  // Update search results only when data is available
  useEffect(() => {
    if (data && Array.isArray(data.users)) {
      setSearchResults(data.users); // Set the fetched users when query returns results
    }
  }, [data]);

  // Debouncing mechanism to avoid excessive API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after delay
    }, 1000); // 1000ms debounce delay

    return () => clearTimeout(timeout); // Clean up timeout on query change
  }, [searchQuery]); // Only run when searchQuery changes

  // Handling the search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]); // Clear results when search input is cleared
    }
  };

  //i want to start chat with the selected user

  const handlestartchat = (selectedUserId) => {
    if (!selectedUserId) {
      console.error("Selected user ID is missing");
      return;
    }

    startchatdata({ userId1: currentUserId, userId2: selectedUserId });
    handleClose(); 
  };
  

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
        {isLoading && debouncedQuery && <Typography>Loading...</Typography>}

        {/* Error State */}
        {isError && <Typography color="error">No user found</Typography>}



        {/* Display search results only if debouncedQuery is not empty */}
        {searchResults.length > 0 &&
          searchResults.map((user) => (
            <ChatElement
              key={user._id} // Ensure each ChatElement has a unique key
              id={user._id}
              username={user.username} // Passing username to ChatElement
              profilePicture={user.profilePicture.url} // Passing profilePicture URL to ChatElement
              online={user.isActive} // Use `isActive` or any other relevant field for online status
              onClick={() => handlestartchat(user._id)} //passing the selected user id
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default StartChat;
