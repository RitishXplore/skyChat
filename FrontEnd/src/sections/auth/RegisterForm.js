import React, { useState, useEffect } from 'react';
import { Alert, Button, IconButton, InputAdornment, Stack, TextField, CircularProgress } from '@mui/material';
import { Eye, EyeSlash } from 'phosphor-react';
import { useGetUsersQuery, useRegisterUserMutation } from './services/RegisterForm.slice.js';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { data: usersData } = useGetUsersQuery();
  const [registerUser, { isLoading, isError, isSuccess }] = useRegisterUserMutation();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().min(6, 'Password must be atleast 6 characters')
      .required('Password is required'),
  })

<<<<<<< Updated upstream
    //validation rules 
    const registerSchema = Yup.object().shape({
      username:Yup.string().required('UserName is required'),
      email:Yup.string().required('Email is required').email('Email must be a valid email address'),
      password:Yup.string().required('Password is required')
    });
  
    const defaultValues = {
      username:'',
      email:'ritishup07@gmail.com',
      password:'ritish@123'
    };
  
    const methods = useForm({
      resolver: yupResolver(registerSchema),
      defaultValues
    });
  
    const {reset, setError, handleSubmit, formState:{errors, isSubmitting, isSubmitSuccessful}}
     = methods;
  
     const onSubmit = async (data) =>{
          try {
              //submit data to backend
          } catch (error) {
              console.log(error);
              reset();
              setError('afterSubmit',{
                  ...error,
                  message: error.message
              })
          }
     }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        <RHFTextField name="username" label='@Username'/>
        <RHFTextField name='email' label='Email address'/>
        <RHFTextField name='password' label='Password' type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment:(
            <InputAdornment>
            <IconButton onClick={()=>{
                setShowPassword(!showPassword);
            }}>
                {showPassword ? <Eye/>: <EyeSlash/>}
            </IconButton>
            </InputAdornment>
        )}}/>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800',
         '&:hover':{
            bgcolor:'text.primary',
            color:(theme)=> theme.palette.mode === 'light' ? 'common.white':'grey.800',
         }}}>Create Account</Button>
        </Stack>
        
    </FormProvider>
  )
}
=======
  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true, // Reset form fields when data changes
    onSubmit: async (values) => {
      console.log('Attempting to register user...', values);
      try {
        const response = await registerUser(values); // Register the user using the mutation
        console.log('API call successful, response:', response);
      } catch (error) {
        console.log('Error:', error);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/login');
    }
  }, [isSuccess]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        {/* Display error if validation fails */}
        {Object.keys(formik.errors).length > 0 && (
          <Alert severity="error">
            {Object.values(formik.errors).map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
          </Alert>
        )}
>>>>>>> Stashed changes

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.username)}
            helperText={formik.errors.username}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'transparent',
              },
              '& .MuiInputBase-root.Mui-focused': {
                backgroundColor: 'transparent'
              },
              '& .MuiInputBase-root.Mui-error': {
                borderColor: 'red'
              },
            }}
          />
        </Stack>

        <TextField
          name="email"
          label="Email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.email)}
          helperText={formik.errors.email}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'transparent',
            },
            '& .MuiInputBase-root.Mui-focused': {
              backgroundColor: 'transparent'
            },
            '& .MuiInputBase-root.Mui-error': {
              borderColor: 'red'
            },
          }}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.password)}
          helperText={formik.errors.password}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'transparent',
            },
            '& .MuiInputBase-root.Mui-focused': {
              backgroundColor: 'transparent'
            },
            '& .MuiInputBase-root.Mui-error': {
              borderColor: 'red'
            },

          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Create Account
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;
