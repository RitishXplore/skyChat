import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import { LinkSimple, PaperPlaneTilt, Smiley, Camera, File, Image, Sticker, User } from 'phosphor-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Cookies from "js-cookie"; 
import { useSendMessageMutation } from '../../sections/auth/services/RegisterForm.slice';

const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
      paddingTop: '12px',
      paddingBottom: '12px',
    }  
}));

const Actions = [
    {
        color:'#4da5fe',
        icon: <Image size={24}/> ,
        y:102,
        title:'Photo/Video'
    },
    {
        color:'#1b8cfe',
        icon: <Sticker size={24}/>,
        y:172,
        title:'Stickers'
    },
    {
        color:'#0172e4',
        icon: <Camera size={24}/>,
        y:242,
        title:'Image'
    },
    {
        color:'#0159b2',
        icon: <File size={24}/>,
        y:312,
        title:'Document'
    },
    {
        color:'#013f7f',
        icon: <User size={24}/>,
        y:382,
        title:'Contact'
    }
];

const ChatInput = ({setOpenPicker, message, setMessage, handleSendMessage}) => {
    const [openAction, setOpenAction] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(); // Send message on Enter key press
        }
    };

    return (
        <StyledInput
            fullWidth
            placeholder='Write a message...'
            variant='filled'
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update the message
            onKeyDown={handleKeyDown} // Add keyDown event handler
            InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <Stack sx={{ width: 'max-content' }}>
                        <Stack sx={{ position: 'relative', display: openAction ? 'inline-block' : 'none' }}>
                            {Actions.map((el) => (
                                <Tooltip placement='right' title={el.title}>
                                    <Fab sx={{ position: 'absolute', top: -el.y, backgroundColor: el.color }}>
                                        {el.icon}
                                    </Fab>
                                </Tooltip>
                            ))}
                        </Stack>
                        <InputAdornment>
                            <IconButton onClick={() => setOpenAction((prev) => !prev)}>
                                <LinkSimple />
                            </IconButton>
                        </InputAdornment>
                    </Stack>
                ),
                endAdornment: (
                    <InputAdornment>
                        <IconButton onClick={() => setOpenPicker((prev) => !prev)}>
                            <Smiley />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

const Footer = ({ user, socket }) => {
    const userId = Cookies.get("userId");
    const theme = useTheme();
    const [openPicker, setOpenPicker] = useState(false);
    const [message, setMessage] = useState(""); 

    const handleSendMessage = async () => {
        if (message.trim()) {
            socket.emit("sendMessage", {
                chatId: user.chatId,
                sender: userId,
                content: message,
                type: "msg",
                timestamp: new Date().toISOString(),
            });
    
            setMessage(""); // Clear the message input
        }
    };
    
    const handleEmojiSelect = async (emoji)=> {
        setMessage((prevMessage)=> prevMessage + emoji.native)
    }

    return (
        <Box p={2} sx={{ width: '100%', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper, boxShadow: '0px 0px 2px rgba(0,0,0,0.25)' }}>
            <Stack direction='row' alignItems={'center'} spacing={3}>
                <Stack sx={{ width: '100%' }}>
                    {/* Chat Input */}
                    <Box sx={{ display: openPicker ? 'inline' : 'none', zIndex: 10, position: 'fixed', bottom: 81, right: 100 }}>
                        <Picker theme={theme.palette.mode} data={data} onEmojiSelect={handleEmojiSelect} />
                    </Box>
                    <ChatInput setOpenPicker={setOpenPicker} message={message} setMessage={setMessage} handleSendMessage={handleSendMessage} />
                </Stack>

                <Box sx={{ height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
                    <Stack sx={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton onClick={handleSendMessage} >
                            <PaperPlaneTilt color='#fff' />
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default Footer;
