import { Box, Stack, Typography, Link, IconButton, Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass, Plus } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import { SimpleBarStyle } from '../../components/Scrollbar';
import '../../css/global.css';
import ChatElement from '../../components/ChatElement';
import CreateGroupDialog from '../../sections/main/CreateGroup';
import {  useGetGroupUsersQuery } from "../../sections/auth/services/RegisterForm.slice";
import Cookies from "js-cookie";
import GroupConversation from '../../components/Conversation'; // Import the Group Conversation component

const GroupChat = () => {
    const theme = useTheme();
    const { data: groupsData } = useGetGroupUsersQuery(Cookies.get("userId"));
    const [groups, setGroups] = useState([]);
    const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null); // State to store the selected group

    // Close the Create Group Dialog
    const handleCloseCreateGroupDialog = () => {
        setIsCreateGroupDialogOpen(false);
    };

    // Update groups data when API response changes
    useEffect(() => {
        if (Array.isArray(groupsData)) {
            setGroups(groupsData);
        } else {
            console.log("No valid group data found.", groupsData);
        }
    }, [groupsData]);

    // Map groups data for UI consumption
    const mappedGroups = groups.map((group) => {
        return {
            chatId: group.chatId,
            groupId: group.groupId,
            name: group.name,
            img: group.icon,
            online: group.status,
            userId : Cookies.get("userId"),

        };
    });

    // Handle group selection
    const handleSelectGroup = (group) => {
        console.log("🔄 handleSelectGroup Triggered");
        console.log("📝 Group Passed to Handler:", group);
    
        setSelectedGroup((prevGroup) => {
            console.log("📊 Previous State:", prevGroup);
            console.log("✅ Updating State with Group:", group);
            return group; // Update the state
        });
    };
    
    useEffect(() => {
        console.log("🚀 State Updated - Selected Group:", selectedGroup);
    }, [selectedGroup]);
    

    return (
        <>
            <Stack direction={'row'} sx={{ width: '100%' }}>
                {/* Sidebar: Group List */}
                <Box sx={{
                    height: '100vh',
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
                    width: 320,
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
                }}>
                    <Stack p={3} spacing={2} sx={{ maxHeight: '100vh' }}>
                        {/* Header */}
                        <Stack>
                            <Typography variant='h5'>Groups</Typography>
                        </Stack>

                        {/* Search Bar */}
                        <Stack sx={{ width: '100%' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <MagnifyingGlass color="#709CE6" />
                                </SearchIconWrapper>
                                <StyledInputBase placeholder='Search Groups...' inputProps={{ "aria-label": "search" }} />
                            </Search>
                        </Stack>

                        {/* Create Group Button */}
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography variant='subtitle2' component={Link}>Create New Group</Typography>
                            <IconButton onClick={() => { setIsCreateGroupDialogOpen(true) }}>
                                <Plus style={{ color: theme.palette.primary.main }} />
                            </IconButton>
                        </Stack>

                        <Divider />

                        {/* Group List */}
                        <Stack spacing={3} className='scrollbar' sx={{ flexGrow: 1, overflowY: 'scroll', height: '100%' }}>
                            <SimpleBarStyle timeout={500} clickOnTrack={false}>
                                <Stack spacing={2.4}>
                                    <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                        All Groups
                                    </Typography>
                                    {Array.isArray(mappedGroups) && mappedGroups.length > 0 ? (
                                        mappedGroups.map((group) => (
                                            <ChatElement
                                                key={group.id}
                                                {...group}
                                                onClick={() => handleSelectGroup(group)} // Update selected group on click
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

                {/* Right: Group Conversation */}
                <Box
                    sx={{
                        height: '100vh',
                        width: 'calc(100% - 320px)',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    {/* Render the selected group's conversation */}
                    {selectedGroup ? (
                        <GroupConversation selectedChat={selectedGroup} /> // Pass the selected group to Conversation
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

            {/* Create Group Dialog */}
            {isCreateGroupDialogOpen && (
                <CreateGroupDialog 
                    open={isCreateGroupDialogOpen} 
                    handleClose={handleCloseCreateGroupDialog} 
                />
            )}
        </>
    );
};

export default GroupChat;
