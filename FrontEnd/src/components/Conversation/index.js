import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import { useGetConversationQuery } from "../../sections/auth/services/RegisterForm.slice";

const Conversation = ({ selectedChat }) => {
  const theme = useTheme();
console.log(selectedChat);
  const { data: userChat, error, isLoading } = useGetConversationQuery({
    userId: selectedChat?.id , chatId :selectedChat?.chatId,
  });

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    console.error("Error fetching conversation", error);
    return (
      <Typography variant="h6" color="error">
        Error loading conversation. Please try again later.
      </Typography>
    );
  }

  return (
    <Stack height="100%" maxHeight="100vh" width="auto">
      {/* Chat header */}
      <Header user={selectedChat} />

      {/* Msg */}
      <Box
        className="scrollbar"
        width={"100%"}
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
      >
        <Message menu={true} Chat_History={userChat?.messages || []} />
      </Box>

      {/* Chat footer */}
      <Footer />
    </Stack>
  );
};

export default Conversation;
