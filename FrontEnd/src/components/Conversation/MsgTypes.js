import { Box, Divider, IconButton, Link, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { DotsThreeVertical, DownloadSimple, Image } from 'phosphor-react';
import React from 'react';
import {Message_options} from '../../data'

const DocMsg = ({el,menu}) => {
    const theme = useTheme();
  return (
    <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
        <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
        <Stack spacing={2}>
            <Stack p={2} spacing={3} direction='row' alignItems='center' 
            sx={{backgroundColor:theme.palette.background.paper, borderRadius:1}}>
                <Image size={48}/>
                <Typography variant='caption'>
                    Abstract.png
                </Typography>
                <IconButton>
                    <DownloadSimple/>
                </IconButton>
            </Stack>
            <Typography variant='body2' sx={{color: el.incoming ? theme.palette.text : '#fff' }} >
                {el.message}
            </Typography>
        </Stack>
        </Box>
        {menu && <MessageOptions/>}
        
    </Stack>
  )
}

const LinkMsg = ({el,menu}) => {
    const theme = useTheme();
  return (
    <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
        <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
        <Stack spacing={2}>
            <Stack p={2} spacing={3} alignItems='start'
             sx={{backgroundColor:theme.palette.background.paper, borderRadius: 1}}>
                <img src={el.preview} alt={el.message} style={{maxHeight:210, borderRadius:'10px'}}/>
                <Stack spacing={2}>
                    <Typography variant='subtitle2'>Creating Chat App</Typography>
                    <Typography variant='subtitle2' sx={{color:theme.palette.primary.main}} 
                    component={Link} to="//https://www.youtube.com">www.youtube.com</Typography>
                </Stack>
                <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                    {el.message}
                </Typography>
            </Stack>
        </Stack>
        </Box>
        {menu && <MessageOptions/>}
    </Stack>
  )
}

const ReplyMsg = ({el, menu}) => {
    const theme = useTheme();
  return (
    <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
        <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
        <Stack spacing={2}>
            <Stack p={2} direction='column' spacing={3} alignItems='center'
            sx={{backgroundColor:theme.palette.background.paper, borderRadius:1}}>
                <Typography variant='body2' color={theme.palette.text}>
                    {el.message}
                </Typography>    
            </Stack>
            <Typography variant='body2' color={ el.incoming ? theme.palette.text : '#fff'}>
                {el.reply}
            </Typography>
        </Stack>
        </Box>
        {menu && <MessageOptions/>}
    </Stack>
  )
}

const MediaMsg = ({el,menu}) => {
    const theme = useTheme();
  return (
    <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
        <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Stack spacing={1}>
                    <img src={el.img} alt={el.message} style={{maxHeight: 210 , borderRadius:'10px'}}/>
                    <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions/>}
    </Stack>
  )
}

const TextMsg = ({ el, menu, isGroupChat, isSender }) => {
    const theme = useTheme();
  
    // Ensure the timestamp is correctly formatted
    const timestamp = el.createdAt ? new Date(el.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }) : '';
  
    return (
      <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
        <Box 
          p={1.5} 
          sx={{
            backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, 
            borderRadius: 1.5, 
            width: 'max-content',
            display: 'flex',
            flexDirection: 'column', // Stack message and timestamp vertically
            alignItems: el.incoming ? 'flex-start' : 'flex-end', // Align left for incoming, right for outgoing
          }}
        >
          {/* Sender's Name (for group chat and non-sender messages) */}
          {isGroupChat && !isSender && el.username && (
            <Typography 
              variant="body2" 
              color={theme.palette.text.secondary} 
              sx={{ fontWeight: 'bold', marginBottom: '4px' }}
            >
              {el.username}
            </Typography>
          )}
  
          {/* Message Content */}
          <Typography 
            variant="body2" 
            color={el.incoming ? theme.palette.text : '#fff'}
            sx={{
              maxWidth: '250px', // Optional: limit width for long messages
              marginBottom: '4px', // Space above the timestamp
            }}
          >
            {el.message}
          </Typography>
  
          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              lineHeight: 0.5,
              color: el.incoming ? theme.palette.text.secondary : '#fff', // Color based on sender/receiver
              fontSize: '0.75rem',
              marginLeft: '8px', // Space between message and timestamp
              whiteSpace: 'nowrap', // Prevent text from wrapping
              alignSelf: 'flex-end', // Ensure timestamp is aligned at the bottom
            }}
          >
            {timestamp}
          </Typography>
        </Box>
  
        {/* Optional Menu (e.g., for options like delete, reply) */}
        {menu && <MessageOptions />}
      </Stack>
    );
  }
  
const TimeLine = ({ el }) => {
    const theme = useTheme();
    return <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Divider width='46%' />
        <Typography variant='caption' sx={{ color: theme.palette.text }}>
            {el.text}
        </Typography>
        <Divider width='46%' />
    </Stack>
}

const MessageOptions = () => {
    
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
    <DotsThreeVertical 
    id="basic-button"
    aria-controls={open ? 'basic-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    onClick={handleClick}
    size={20}
    />

    <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
      <Stack spacing={1} px={1}>
        {Message_options.map((el)=>(
            <MenuItem onClick={handleClick}>{el.title}</MenuItem>
        ))}
      </Stack>
      </Menu>
    </>
  )
}


// should not be default export, because we need to export multiple things
export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg }