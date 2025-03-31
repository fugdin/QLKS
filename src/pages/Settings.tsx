import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import settingsService from '../services/settingsService';

const validationSchema = yup.object({
  hotelName: yup.string().required('Vui lòng nhập tên khách sạn'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  taxRate: yup
    .number()
    .required('Vui lòng nhập thuế suất')
    .min(0, 'Thuế suất phải lớn hơn hoặc bằng 0')
    .max(100, 'Thuế suất phải nhỏ hơn hoặc bằng 100'),
  checkInTime: yup.string().required('Vui lòng nhập giờ check-in'),
  checkOutTime: yup.string().required('Vui lòng nhập giờ check-out'),
  currency: yup.string().required('Vui lòng chọn đơn vị tiền tệ'),
  language: yup.string().required('Vui lòng chọn ngôn ngữ'),
  theme: yup.string().required('Vui lòng chọn giao diện'),
});

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi tải cài đặt',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      hotelName: settings?.hotelName || '',
      address: settings?.address || '',
      phone: settings?.phone || '',
      email: settings?.email || '',
      taxRate: settings?.taxRate || 0,
      checkInTime: settings?.checkInTime || '14:00',
      checkOutTime: settings?.checkOutTime || '12:00',
      currency: settings?.currency || 'VND',
      language: settings?.language || 'vi',
      theme: settings?.theme || 'light',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await settingsService.updateSettings(values);
        setSnackbar({
          open: true,
          message: 'Cập nhật cài đặt thành công',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error updating settings:', error);
        setSnackbar({
          open: true,
          message: 'Lỗi khi cập nhật cài đặt',
          severity: 'error',
        });
      }
    },
  });

  const handleReset = async () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
      try {
        const defaultSettings = await settingsService.resetSettings();
        setSettings(defaultSettings);
        setSnackbar({
          open: true,
          message: 'Đã khôi phục cài đặt mặc định',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error resetting settings:', error);
        setSnackbar({
          open: true,
          message: 'Lỗi khi khôi phục cài đặt',
          severity: 'error',
        });
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cài đặt hệ thống
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin khách sạn
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="hotelName"
                label="Tên khách sạn"
                value={formik.values.hotelName}
                onChange={formik.handleChange}
                error={formik.touched.hotelName && Boolean(formik.errors.hotelName)}
                helperText={formik.touched.hotelName && formik.errors.hotelName?.toString()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="address"
                label="Địa chỉ"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address?.toString()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                label="Số điện thoại"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone?.toString()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email?.toString()}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Cài đặt hệ thống
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="taxRate"
                label="Thuế suất (%)"
                type="number"
                value={formik.values.taxRate}
                onChange={formik.handleChange}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate?.toString()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="checkInTime"
                label="Giờ check-in"
                type="time"
                value={formik.values.checkInTime}
                onChange={formik.handleChange}
                error={formik.touched.checkInTime && Boolean(formik.errors.checkInTime)}
                helperText={formik.touched.checkInTime && formik.errors.checkInTime?.toString()}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="checkOutTime"
                label="Giờ check-out"
                type="time"
                value={formik.values.checkOutTime}
                onChange={formik.handleChange}
                error={formik.touched.checkOutTime && Boolean(formik.errors.checkOutTime)}
                helperText={formik.touched.checkOutTime && formik.errors.checkOutTime?.toString()}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="currency"
                label="Đơn vị tiền tệ"
                value={formik.values.currency}
                onChange={formik.handleChange}
                error={formik.touched.currency && Boolean(formik.errors.currency)}
                helperText={formik.touched.currency && formik.errors.currency?.toString()}
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="language"
                label="Ngôn ngữ"
                value={formik.values.language}
                onChange={formik.handleChange}
                error={formik.touched.language && Boolean(formik.errors.language)}
                helperText={formik.touched.language && formik.errors.language?.toString()}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="theme"
                label="Giao diện"
                value={formik.values.theme}
                onChange={formik.handleChange}
                error={formik.touched.theme && Boolean(formik.errors.theme)}
                helperText={formik.touched.theme && formik.errors.theme?.toString()}
              >
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  Lưu cài đặt
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                >
                  Khôi phục mặc định
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;