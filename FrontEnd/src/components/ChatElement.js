import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StyledBadge from './StyledBadge';

const ChatElement = ({ id, name, img, msg, time, online, unread, onClick }) => {
  const theme = useTheme();

  // Check if img is an SVG and process accordingly
  const isSvg = img && img.endsWith('.svg');

  // Function to safely handle SVG embedding (only if you control the SVG content)
  const renderAvatar = () => {
    if (isSvg) {
      return (
        <Avatar>
          {/* Inline rendering of SVG content */}
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: img }}
          />
        </Avatar>
      );
    }
    return <Avatar src={img} />;
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default,
        cursor: onClick ? 'pointer' : 'default',  // Make it clickable only if onClick is passed
        '&:hover': {
          backgroundColor: onClick ? '#f5f5f5' : 'transparent', // Add hover effect only if clickable
        },
      }}
      p={2}
      onClick={onClick}  // Handle onClick event if passed
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              {renderAvatar()}
            </StyledBadge>
          ) : (
            renderAvatar()
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
        </Stack>

        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          {unread > 0 && <Badge color="primary" badgeContent={unread} />}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
