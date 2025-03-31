import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import taiKhoanService from '../services/taiKhoanService';

const validationSchema = yup.object({
  TenDangNhap: yup.string().required('Vui lòng nhập tên đăng nhập'),
  MatKhau: yup.string().required('Vui lòng nhập mật khẩu'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      TenDangNhap: '',
      MatKhau: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await taiKhoanService.login(values);
        localStorage.setItem('token', response.MaTK);
        localStorage.setItem('user', JSON.stringify(response));
        navigate('/');
      } catch (error) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="TenDangNhap"
              label="Tên đăng nhập"
              name="TenDangNhap"
              autoComplete="username"
              autoFocus
              value={formik.values.TenDangNhap}
              onChange={formik.handleChange}
              error={formik.touched.TenDangNhap && Boolean(formik.errors.TenDangNhap)}
              helperText={formik.touched.TenDangNhap && formik.errors.TenDangNhap}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="MatKhau"
              label="Mật khẩu"
              type="password"
              id="MatKhau"
              autoComplete="current-password"
              value={formik.values.MatKhau}
              onChange={formik.handleChange}
              error={formik.touched.MatKhau && Boolean(formik.errors.MatKhau)}
              helperText={formik.touched.MatKhau && formik.errors.MatKhau}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/register" variant="body2">
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 