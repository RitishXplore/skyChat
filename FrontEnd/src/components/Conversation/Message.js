import { Box, Stack } from '@mui/material';
import React from 'react';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';

import { useEffect, useRef } from 'react';

const Message = ({ menu, Chat_History }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when Chat_History changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Chat_History]);

  return (
    <Box p={3} sx={{ height: "100%", overflowY: "auto" }}>
        <Stack spacing={3} sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {Chat_History.map((el) => {
            switch (el.type) {
                case 'divider':
                    return <TimeLine key={el.id || el.timestamp} el={el} />;
                case 'msg':
                    switch (el.subtype) {
                        case 'img':
                            return <MediaMsg key={el.id || el.timestamp} el={el} menu={menu} />;
                        case 'doc':
                            return <DocMsg key={el.id || el.timestamp} el={el} menu={menu} />;
                        case 'link':
                            return <LinkMsg key={el.id || el.timestamp} el={el} menu={menu} />;
                        case 'reply':
                            return <ReplyMsg key={el.id || el.timestamp} el={el} menu={menu} />;
                        default:
                            return <TextMsg key={el.id || el.timestamp} el={el} menu={menu} />;
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
}


export default Message;
