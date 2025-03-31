import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import customerService from '../services/customerService';
import { KhachHang } from '../types';

const validationSchema = yup.object({
  HoTen: yup.string().required('Vui lòng nhập họ tên'),
  CMND_CCCD: yup
    .number()
    .required('Vui lòng nhập CMND/CCCD')
    .positive('CMND/CCCD phải là số dương'),
  DiaChi: yup.string().required('Vui lòng nhập địa chỉ'),
  SoDienThoai: yup
    .number()
    .required('Vui lòng nhập số điện thoại')
    .positive('Số điện thoại phải là số dương'),
  Email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
});

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<KhachHang[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpen = (customer?: KhachHang) => {
    if (customer) {
      setSelectedCustomer(customer);
      setIsEdit(true);
    } else {
      setSelectedCustomer(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      HoTen: selectedCustomer?.HoTen || '',
      CMND_CCCD: selectedCustomer?.CMND_CCCD || 0,
      DiaChi: selectedCustomer?.DiaChi || '',
      SoDienThoai: selectedCustomer?.SoDienThoai || 0,
      Email: selectedCustomer?.Email || ''
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const customerData = {
          ...values,
          CMND_CCCD: Number(values.CMND_CCCD),
          SoDienThoai: Number(values.SoDienThoai)
        };
        if (isEdit && selectedCustomer) {
          await customerService.updateCustomer(selectedCustomer.MaKH, customerData);
        } else {
          await customerService.createCustomer(customerData);
        }
        handleClose();
        fetchCustomers();
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Khách hàng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm khách hàng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã KH</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>CMND/CCCD</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.MaKH}>
                <TableCell>{customer.MaKH}</TableCell>
                <TableCell>{customer.HoTen}</TableCell>
                <TableCell>{customer.CMND_CCCD}</TableCell>
                <TableCell>{customer.DiaChi}</TableCell>
                <TableCell>{customer.SoDienThoai}</TableCell>
                <TableCell>{customer.Email}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(customer.MaKH)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="HoTen"
              label="Họ tên"
              value={formik.values.HoTen}
              onChange={formik.handleChange}
              error={formik.touched.HoTen && Boolean(formik.errors.HoTen)}
              helperText={formik.touched.HoTen && formik.errors.HoTen}
            />
            <TextField
              fullWidth
              margin="normal"
              name="CMND_CCCD"
              label="CMND/CCCD"
              type="number"
              value={formik.values.CMND_CCCD}
              onChange={formik.handleChange}
              error={formik.touched.CMND_CCCD && Boolean(formik.errors.CMND_CCCD)}
              helperText={formik.touched.CMND_CCCD && formik.errors.CMND_CCCD}
            />
            <TextField
              fullWidth
              margin="normal"
              name="DiaChi"
              label="Địa chỉ"
              value={formik.values.DiaChi}
              onChange={formik.handleChange}
              error={formik.touched.DiaChi && Boolean(formik.errors.DiaChi)}
              helperText={formik.touched.DiaChi && formik.errors.DiaChi}
            />
            <TextField
              fullWidth
              margin="normal"
              name="SoDienThoai"
              label="Số điện thoại"
              type="number"
              value={formik.values.SoDienThoai}
              onChange={formik.handleChange}
              error={formik.touched.SoDienThoai && Boolean(formik.errors.SoDienThoai)}
              helperText={formik.touched.SoDienThoai && formik.errors.SoDienThoai}
            />
            <TextField
              fullWidth
              margin="normal"
              name="Email"
              label="Email"
              value={formik.values.Email}
              onChange={formik.handleChange}
              error={formik.touched.Email && Boolean(formik.errors.Email)}
              helperText={formik.touched.Email && formik.errors.Email}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement; 