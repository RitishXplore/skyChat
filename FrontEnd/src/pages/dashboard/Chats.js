import { Box, IconButton, Stack, Typography, InputBase, Link, Button, Divider } from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Search, SearchIconWrapper, StyledInputBase } from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import { useGetUsersQuery } from "../../sections/auth/services/RegisterForm.slice";
import Cookies from "js-cookie";
import StartChat from "../../sections/main/StartChat";

const Chats = ({ onSelectChat }) => {
  const theme = useTheme();
  const { data: usersData } = useGetUsersQuery(Cookies.get("userId"));
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    } else {
      console.log("No valid users data found.");
    }
  }, [usersData]);

  const mappedUsers = users.map((user) => {
    return {
      id: user.userId,
      chatId:user.chatId,
      username: user.username,
      img: user.profilePicture?.url || user.profilePicture,
      online: user.status,
    };
  });

  console.log(mappedUsers, usersData);

  return (
    <Box
      sx={{
        position: "relative",
        width: 320,
        backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>

        {/* Search */}
        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} />
          </Search>
        </Stack>

        {/* Start Conversation */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" component={Link}>
            Start Conversation
          </Typography>
          <IconButton
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <Plus style={{ color: theme.palette.primary.main }} />
          </IconButton>
        </Stack>

        {/* Archive */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ArchiveBox size={24} />
            <Button>Archive</Button>
          </Stack>
          <Divider />
        </Stack>

        {/* Chat List */}
        <Stack
          className="scrollbar"
          spacing={2}
          direction="column"
          sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}
        >
          {/* All Chats */}
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              All Chats
            </Typography>
            {Array.isArray(mappedUsers) && mappedUsers.length > 0 ? (
              mappedUsers.map((el) => (
                <ChatElement
                  key={el.id}
                  {...el}
                  onClick={() => onSelectChat(el)} // 👈 Pass selected chat back to GeneralApp
                />
              ))
            ) : (
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                No chats found
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Dialog for Starting a New Chat */}
      {openDialog && <StartChat open={openDialog} handleClose={handleCloseDialog} />}
    </Box>
  );
};

export default Chats;
