import React, { useState } from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";

const GeneralApp = ({ socket }) => {
  const theme = useTheme();
  const { sidebar } = useSelector((store) => store.app);

  // State to manage selected chat
  const [selectedChat, setSelectedChat] = useState(null);

  // Handle chat selection
  const handleSelectChat = (chat) => {
    console.log(chat);
    setSelectedChat(chat);
  };

  return (
    <Stack direction="row" sx={{ width: "100%" }}>
      {/* Chats */}
      <Chats onSelectChat={handleSelectChat} />

      {/* Conversation */}
      <Box
        sx={{
          height: "100%",
          width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background.default,
        }}
      >
        {selectedChat ? (
          <Conversation selectedChat={selectedChat} socket={socket} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <h3>Select a chat to start a conversation</h3>
          </Box>
        )}
      </Box>

      {/* Sidebar */}
      {sidebar.open &&
        (() => {
          switch (sidebar.type) {
            case "CONTACT":
              return <Contact />;
            case "STARRED":
              return <StarredMessages />;
            case "SHARED":
              return <SharedMessages />;
            default:
              return null;
          }
        })()}
    </Stack>
  );
};

export default GeneralApp;
