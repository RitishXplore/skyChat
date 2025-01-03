import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFTextField } from '../../components/hook-form';
import RHFAutocomplete from '../../components/hook-form/RHFAutocomplete';
import { useGetAllUsersQuery, useCreateGroupMutation } from '../auth/services/RegisterForm.slice';
import Cookies from "js-cookie";
// Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
  const currentUserId = Cookies.get("userId");
// Validation Schema
const NewGroupSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  members: Yup.array()
    .min(2, 'Must have at least 2 members')
    .required('Members are required'),
});

// Default values
const defaultValues = {
  title: '',
  members: [],
};

// CreateGroupForm Component
const CreateGroupForm = ({ handleClose }) => {
  const [members, setMembers] = useState([]);

  // Fetch all users
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery();

  useEffect(() => {
    if (usersData) {
      setMembers(
        usersData.users.map((user) => ({
          id: user._id,
          username: user.username,
          img: user.profilePicture?.url || user.profilePicture,
          online: user.status,
        }))
      );
    }
  }, [usersData]);

  // Form methods
  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  // Use the createGroup mutation
  const [createGroup, { isLoading: isCreating, error }] = useCreateGroupMutation();

  const onSubmit = async (data) => {
    try {
      const groupData = {
        groupName: data.title,
        userIds: data.members.map((member) => member.id),
        createdBy: currentUserId, // Replace with actual user ID
      };
      console.log(groupData);
      // Call the API to create the group
      await createGroup(groupData).unwrap();
      handleClose();  // Close the dialog after the group is created
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseDialog = () => {
    reset();
    handleClose();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Title Field */}
        <RHFTextField name="title" label="Title" />

        {/* Members Field */}
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          options={members}
          ChipProps={{ size: 'medium' }}
          loading={isLoading}
        />

        {/* Action Buttons */}
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="end">
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || !isValid || isCreating}>
            {isSubmitting || isCreating ? 'Creating...' : 'Create'}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

// CreateGroup Component
const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      {/* Title */}
      <DialogTitle sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
        Create New Group
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
