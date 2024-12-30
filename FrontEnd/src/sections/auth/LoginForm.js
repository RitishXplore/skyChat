import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AuthSocial from '../../sections/auth/AuthSocial';
import LoginForm from '../../sections/auth/LoginForm';
import { useLoginUserMutation } from '../../sections/auth/services/RegisterForm.slice';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
const Login = () => {

  const [loginuser, { isLoading, isError, isSuccess }] = useLoginUserMutation();
  const [showpassword, setshowpassword] = useState(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  })


  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await loginuser(values);
        console.log('API call successful, response:', response);
      } catch (error) {
        console.error('API call failed:', error);
      }
    }
  })
  useEffect(() => {
    if (isSuccess) {
      navigate('/app');
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        {Object.keys(formik.errors).length > 0 && (
          <Alert severity="error">
            {Object.values(formik.errors).map((error, idx) => {
              <div key={idx}>{error}</div>
            })}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            name="email"
            label="Email"
            fullWidth
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
        </Stack>

        <TextField
          name="password"
          label="Password"
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
        />

        <Button
          fullWidth
          color='inherit'
          size='large'
          type='submit'
          variant='contained'
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Log In
        </Button>

      </Stack>
    </form>
  )
}

export default Login