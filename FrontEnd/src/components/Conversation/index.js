import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import socket from '../../services/socket.io';
import Cookies from "js-cookie";
import { useGetConversationQuery } from "../../sections/auth/services/RegisterForm.slice";

const Conversation = ({ selectedChat }) => {
  const theme = useTheme();
  const [Chat_History, setChat_History] = useState([]);
  const userId = Cookies.get("userId"); // Get the logged-in user's ID

  const { data: userChat, error, isLoading } = useGetConversationQuery({
    userId: userId,
    chatId: selectedChat?.chatId,
  });

  const isListenerAdded = useRef(false); // Ref to prevent duplicate listeners

  // 🚀 Handle Socket.IO Events
  useEffect(() => {
    if (selectedChat?.chatId) {
      socket.connect();
      socket.emit("joinRoom", selectedChat.chatId);

      const handleReceiveMessage = (message) => {
        console.log("Received message:", message); // Debugging the message

        // Ensure the message has a unique identifier (e.g., message.id)
        if (!message._id) {
          console.error("Message received without an ID:", message);
          return;
        }

        const formattedMessage = {
          ...message,
          type:'msg',
          outgoing: message.sender === userId,
          incoming: message.sender !== userId,
          messageId:message._id,
          message :message.content
        };

        setChat_History((prev) => {
          // Prevent duplicate messages by checking the message ID
          const exists = prev.some((msg) => msg.messageId === formattedMessage.messageId);
          if (!exists) {
            console.log("Adding new message to history:", formattedMessage); // Debugging
            return [...prev, formattedMessage];
          }
          return prev;
        });
      };

      if (!isListenerAdded.current) {
        socket.on("receiveMessage", handleReceiveMessage);
        isListenerAdded.current = true; // Mark listener as added
      }

      return () => {
        socket.emit("leaveRoom", selectedChat?.chatId);
        socket.off("receiveMessage", handleReceiveMessage);
        socket.disconnect();
        isListenerAdded.current = false; // Reset ref on cleanup
      };
    }
  }, [selectedChat?.chatId, userId]);

  // 🚀 Sync Messages from API
  useEffect(() => {
    if (userChat?.messages) {
      setChat_History(
        userChat.messages.map((message) => ({
          ...message,
        }))
      );
    }
  }, [userChat?.messages, userId]);

  // 🚀 Loading State
  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%">
        <CircularProgress />
      </Stack>
    );
  }

  // 🚀 Error State
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
      {/* Chat Header */}
      <Header user={selectedChat} />

      {/* Messages */}
      <Box
        className="scrollbar"
        width={"100%"}
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
      >
        <Message menu={false} Chat_History={Chat_History} />
      </Box>

      {/* Chat Footer */}
      <Footer user={selectedChat} socket={socket} setChat_History={setChat_History} />
    </Stack>
  );
};

export default Conversation;
