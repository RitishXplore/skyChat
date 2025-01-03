import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';

const Message = ({ menu, Chat_History }) => {
  const messagesEndRef = useRef(null);
  console.log(Chat_History);
  // Scroll to the bottom when Chat_History changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Chat_History]);

  // Ensure Chat_History is an array before trying to map over it
  if (!Array.isArray(Chat_History)) {
    return null; // Or return a loading state, depending on your needs
  }

  return (
    <Box p={3} sx={{ height: "100%", overflowY: "auto" }}>
      <Stack spacing={3} sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case 'divider':
              return <TimeLine key={el.id || el.createdAt} el={el} />;
            case 'msg':
              switch (el.subtype) {
                case 'img':
                  return <MediaMsg key={el.id || el.createdAt} el={el} menu={menu} />;
                case 'doc':
                  return <DocMsg key={el.id || el.createdAt} el={el} menu={menu} />;
                case 'link':
                  return <LinkMsg key={el.id || el.createdAt} el={el} menu={menu} />;
                case 'reply':
                  return <ReplyMsg key={el.id || el.createdAt} el={el} menu={menu} />;
                default:
                  return <TextMsg key={el.id || el.createdAt} el={el} isGroupChat={el.isGroupChat} isSender={el.isSender} menu={menu} />;
              }
            default:
              return null;
          }
        })}
        {/* Empty div to act as a scroll target */}
        <div ref={messagesEndRef} />
      </Stack>
    </Box>
  );
};

export default Message;
