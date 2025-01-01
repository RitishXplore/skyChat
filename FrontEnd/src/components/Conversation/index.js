import {  Box, Stack} from '@mui/material';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import Cookies from "js-cookie"; // Cookie management for checking if the user is logged in
import { useGetConversationQuery } from '../../sections/auth/services/RegisterForm.slice';
const Conversation = () => {
  const theme = useTheme();
  const userId = Cookies.get("userId");
  const chatId = "67758280c9a8eb8ef276a885"; // Use the actual chatId for the conversation

  // Pass both userId and chatId in an object
  const { data: userChat, error } = useGetConversationQuery({ userId});

  // Check if there was an error fetching the data
  if (error) {
    console.error("Error fetching conversation", error);
  }

  console.log(userChat);

  return (
    <Stack height={'100%'} maxHeight={'100vh'} width={'auto'}>
      {/* Chat header */}
      <Header />
      {/* Msg */}
      <Box className='scrollbar' width={"100%"} sx={{flexGrow:1, height:'100%', overflowY:'scroll'}}>
        <Message menu={true} Chat_History={userChat?.messages || []} />
      </Box>
      {/* Chat footer */}
      <Footer />
    </Stack>
  );
}

export default Conversation;
