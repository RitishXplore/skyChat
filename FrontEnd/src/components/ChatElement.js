import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StyledBadge from './StyledBadge';

const ChatElement = ({ id, username, profilePicture, msg, time, online, unread }) => {
  const theme = useTheme();

  // Check if profilePicture is an SVG and process accordingly
  const isSvg = profilePicture && profilePicture.endsWith('.svg');
  
  // Function to safely handle SVG embedding (only if you control the SVG content)
  const renderAvatar = () => {
    if (isSvg) {
      return (
        <Avatar>
          {/* Inline rendering of SVG content */}
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: profilePicture }}
          />
        </Avatar>
      );
    }
    return <Avatar src={profilePicture} />;
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default,
      }}
      p={2}
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
            <Typography variant="subtitle2">{username}</Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
        </Stack>

        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          {unread > 0 && (
            <Badge color="primary" badgeContent={unread} />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
