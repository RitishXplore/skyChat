import { Box, Stack, Typography, Link, IconButton, Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import { SimpleBarStyle } from '../../components/Scrollbar';
import '../../css/global.css';
import { ChatList } from '../../data';
import ChatElement from '../../components/ChatElement';
import CreateGroup from '../../sections/main/CreateGroup';
import { useGetGroupUsersQuery } from "../../sections/auth/services/RegisterForm.slice";
import Cookies from "js-cookie";
import Conversation from '../../components/Conversation'; // Import the Conversation component

const Group = () => {
    const theme = useTheme();
    const { data: usersData } = useGetGroupUsersQuery(Cookies.get("userId"));
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null); // State to store the selected group

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (Array.isArray(usersData)) {
            setUsers(usersData);
        } else {
            console.log("No valid users data found.", usersData);
        }
    }, [usersData]);

    const mappedUsers = users.map((user) => {
        return {
            id: user.userId,
            chatId: user.groupId,
            username: user.name,
            img: user.icon,
            online: user.status,
        };
    });

    const handleSelectGroup = (group) => {
        setSelectedGroup(group); // Update the state with the selected group
    };

    return (
        <>
            <Stack direction={'row'} sx={{ width: '100%' }}>
                {/* Left */}
                <Box sx={{
                    height: '100vh',
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
                    width: 320,
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
                }}>
                    <Stack p={3} spacing={2} sx={{ maxHeight: '100vh' }}>
                        <Stack>
                            <Typography variant='h5'>Group</Typography>
                        </Stack>
                        <Stack sx={{ width: '100%' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <MagnifyingGlass color="#709CE6" />
                                </SearchIconWrapper>
                                <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
                            </Search>
                        </Stack>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography variant='subtitle2' component={Link}>Create New Group</Typography>
                            <IconButton onClick={() => { setOpenDialog(true) }}>
                                <Plus style={{ color: theme.palette.primary.main }} />
                            </IconButton>
                        </Stack>
                        <Divider />
                        <Stack spacing={3} className='scrollbar' sx={{ flexGrow: 1, overflowY: 'scroll', height: '100%' }}>
                            <SimpleBarStyle timeout={500} clickOnTrack={false}>
                                <Stack spacing={2.4}>
                                    <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                        All Groups
                                    </Typography>
                                    {Array.isArray(mappedUsers) && mappedUsers.length > 0 ? (
                                        mappedUsers.map((el) => (
                                            <ChatElement
                                                key={el.id}
                                                {...el}
                                                onClick={() => handleSelectGroup(el)} // Update selected group on click
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                            No groups found
                                        </Typography>
                                    )}
                                </Stack>
                            </SimpleBarStyle>
                        </Stack>
                    </Stack>
                </Box>

                {/* Right */}
                <Box
                    sx={{
                        height: '100vh',
                        width: 'calc(100% - 320px)',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    {/* Render the selected group's conversation */}
                    {selectedGroup ? (
                        <Conversation selectedChat={selectedGroup} /> // Pass the selected group to Conversation
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <h3>Select a group to start the conversation</h3>
                        </Box>
                    )}
                </Box>
            </Stack>
            {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
        </>
    );
};

export default Group;
