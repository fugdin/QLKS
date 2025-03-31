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
  Grid,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import taiKhoanService from '../services/taiKhoanService';
import nhanVienService from '../services/nhanVienService';

const validationSchema = yup.object({
  HoTen: yup.string().required('Vui lòng nhập họ tên'),
  Email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  SoDienThoai: yup.string().required('Vui lòng nhập số điện thoại'),
  DiaChi: yup.string().required('Vui lòng nhập địa chỉ'),
  NgaySinh: yup.date().required('Vui lòng chọn ngày sinh'),
  GioiTinh: yup.string().required('Vui lòng chọn giới tính'),
  ChucVu: yup.string().required('Vui lòng chọn chức vụ'),
  TenDangNhap: yup.string().required('Vui lòng nhập tên đăng nhập'),
  MatKhau: yup.string().required('Vui lòng nhập mật khẩu'),
  XacNhanMatKhau: yup
    .string()
    .oneOf([yup.ref('MatKhau')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      HoTen: '',
      Email: '',
      SoDienThoai: '',
      DiaChi: '',
      NgaySinh: new Date(),
      GioiTinh: 'Nam',
      ChucVu: 'Nhân viên',
      TenDangNhap: '',
      MatKhau: '',
      XacNhanMatKhau: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Tạo nhân viên mới
        const nhanVienData = {
          HoTen: values.HoTen,
          Email: values.Email,
          SoDienThoai: values.SoDienThoai,
          DiaChi: values.DiaChi,
          NgaySinh: values.NgaySinh.toISOString(),
          GioiTinh: values.GioiTinh,
          ChucVu: values.ChucVu,
          NgayVaoLam: new Date().toISOString(),
          Luong: 0,
          TrangThai: 'Đang làm việc',
          GhiChu: '',
        };

        const nhanVien = await nhanVienService.createNhanVien(nhanVienData);

        // Tạo tài khoản mới
        const taiKhoanData = {
          MaNV: nhanVien.MaNV,
          TenDangNhap: values.TenDangNhap,
          MatKhau: values.MatKhau,
          VaiTro: 'Nhân viên',
          TrangThai: true,
        };

        await taiKhoanService.register(taiKhoanData);
        navigate('/login');
      } catch (error) {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    },
  });

  return (
    <Container component="main" maxWidth="md">
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
            Đăng ký tài khoản
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="HoTen"
                  label="Họ tên"
                  value={formik.values.HoTen}
                  onChange={formik.handleChange}
                  error={formik.touched.HoTen && Boolean(formik.errors.HoTen)}
                  helperText={formik.touched.HoTen && formik.errors.HoTen}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="Email"
                  label="Email"
                  value={formik.values.Email}
                  onChange={formik.handleChange}
                  error={formik.touched.Email && Boolean(formik.errors.Email)}
                  helperText={formik.touched.Email && formik.errors.Email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="SoDienThoai"
                  label="Số điện thoại"
                  value={formik.values.SoDienThoai}
                  onChange={formik.handleChange}
                  error={formik.touched.SoDienThoai && Boolean(formik.errors.SoDienThoai)}
                  helperText={formik.touched.SoDienThoai && formik.errors.SoDienThoai}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="DiaChi"
                  label="Địa chỉ"
                  value={formik.values.DiaChi}
                  onChange={formik.handleChange}
                  error={formik.touched.DiaChi && Boolean(formik.errors.DiaChi)}
                  helperText={formik.touched.DiaChi && formik.errors.DiaChi}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="NgaySinh"
                  label="Ngày sinh"
                  value={formik.values.NgaySinh.toISOString().split('T')[0]}
                  onChange={formik.handleChange}
                  error={formik.touched.NgaySinh && Boolean(formik.errors.NgaySinh)}
                  helperText={formik.touched.NgaySinh && formik.errors.NgaySinh ? String(formik.errors.NgaySinh) : ''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="GioiTinh"
                  label="Giới tính"
                  value={formik.values.GioiTinh}
                  onChange={formik.handleChange}
                  error={formik.touched.GioiTinh && Boolean(formik.errors.GioiTinh)}
                  helperText={formik.touched.GioiTinh && formik.errors.GioiTinh}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="ChucVu"
                  label="Chức vụ"
                  value={formik.values.ChucVu}
                  onChange={formik.handleChange}
                  error={formik.touched.ChucVu && Boolean(formik.errors.ChucVu)}
                  helperText={formik.touched.ChucVu && formik.errors.ChucVu}
                >
                  <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                  <MenuItem value="Lễ tân">Lễ tân</MenuItem>
                  <MenuItem value="Bảo vệ">Bảo vệ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="TenDangNhap"
                  label="Tên đăng nhập"
                  value={formik.values.TenDangNhap}
                  onChange={formik.handleChange}
                  error={formik.touched.TenDangNhap && Boolean(formik.errors.TenDangNhap)}
                  helperText={formik.touched.TenDangNhap && formik.errors.TenDangNhap}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="MatKhau"
                  label="Mật khẩu"
                  type="password"
                  value={formik.values.MatKhau}
                  onChange={formik.handleChange}
                  error={formik.touched.MatKhau && Boolean(formik.errors.MatKhau)}
                  helperText={formik.touched.MatKhau && formik.errors.MatKhau}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="XacNhanMatKhau"
                  label="Xác nhận mật khẩu"
                  type="password"
                  value={formik.values.XacNhanMatKhau}
                  onChange={formik.handleChange}
                  error={formik.touched.XacNhanMatKhau && Boolean(formik.errors.XacNhanMatKhau)}
                  helperText={formik.touched.XacNhanMatKhau && formik.errors.XacNhanMatKhau}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Đã có tài khoản? Đăng nhập
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 