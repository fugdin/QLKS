import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  hoTen: yup.string().required('Vui lòng nhập họ tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  soDienThoai: yup.string().required('Vui lòng nhập số điện thoại'),
  diaChi: yup.string(),
});

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      hoTen: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      soDienThoai: '0123456789',
      diaChi: 'Hà Nội',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setIsEditing(false);
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              mb: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {formik.values.hoTen}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {formik.values.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="hoTen"
                label="Họ tên"
                value={formik.values.hoTen}
                onChange={formik.handleChange}
                error={formik.touched.hoTen && Boolean(formik.errors.hoTen)}
                helperText={formik.touched.hoTen && formik.errors.hoTen}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="soDienThoai"
                label="Số điện thoại"
                value={formik.values.soDienThoai}
                onChange={formik.handleChange}
                error={formik.touched.soDienThoai && Boolean(formik.errors.soDienThoai)}
                helperText={formik.touched.soDienThoai && formik.errors.soDienThoai}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="diaChi"
                label="Địa chỉ"
                value={formik.values.diaChi}
                onChange={formik.handleChange}
                error={formik.touched.diaChi && Boolean(formik.errors.diaChi)}
                helperText={formik.touched.diaChi && formik.errors.diaChi}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                    >
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile; 