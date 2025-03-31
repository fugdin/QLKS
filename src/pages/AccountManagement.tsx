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
  Grid,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import taiKhoanService from '../services/taiKhoanService';
import nhanVienService from '../services/nhanVienService';
import { TaiKhoan, NhanVien } from '../types';

const validationSchema = yup.object({
  MaNV: yup.string().required('Vui lòng chọn nhân viên'),
  TenDangNhap: yup.string().required('Vui lòng nhập tên đăng nhập'),
  MatKhau: yup.string().required('Vui lòng nhập mật khẩu'),
  VaiTro: yup.string().required('Vui lòng chọn vai trò'),
  TrangThai: yup.boolean(),
});

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<TaiKhoan[]>([]);
  const [employees, setEmployees] = useState<NhanVien[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TaiKhoan | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = async () => {
    try {
      const [accountsData, employeesData] = await Promise.all([
        taiKhoanService.getAllTaiKhoans(),
        nhanVienService.getAllNhanViens(),
      ]);
      setAccounts(accountsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (account?: TaiKhoan) => {
    if (account) {
      setSelectedAccount(account);
      setIsEdit(true);
    } else {
      setSelectedAccount(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      MaNV: selectedAccount?.MaNV || '',
      TenDangNhap: selectedAccount?.TenDangNhap || '',
      MatKhau: selectedAccount?.MatKhau || '',
      VaiTro: selectedAccount?.VaiTro || 'Nhân viên',
      TrangThai: selectedAccount?.TrangThai ?? true,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit && selectedAccount) {
          await taiKhoanService.updateTaiKhoan(selectedAccount.MaTK, values);
        } else {
          await taiKhoanService.register(values);
        }
        handleClose();
        fetchData();
      } catch (error) {
        console.error('Error saving account:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await taiKhoanService.deleteTaiKhoan(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.MaNV === employeeId);
    return employee ? employee.HoTen : '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Tài Khoản</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm tài khoản
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã TK</TableCell>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Đăng nhập cuối</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.MaTK}>
                <TableCell>{account.MaTK}</TableCell>
                <TableCell>{getEmployeeName(account.MaNV)}</TableCell>
                <TableCell>{account.TenDangNhap}</TableCell>
                <TableCell>{account.VaiTro}</TableCell>
                <TableCell>
                  <Chip
                    label={account.TrangThai ? 'Hoạt động' : 'Khóa'}
                    color={account.TrangThai ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(account.NgayTao).toLocaleDateString()}</TableCell>
                <TableCell>
                  {account.NgayDangNhapCuoi
                    ? new Date(account.NgayDangNhapCuoi).toLocaleDateString()
                    : 'Chưa đăng nhập'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(account)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(account.MaTK)}
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="MaNV"
                  label="Nhân viên"
                  value={formik.values.MaNV}
                  onChange={formik.handleChange}
                  error={formik.touched.MaNV && Boolean(formik.errors.MaNV)}
                  helperText={formik.touched.MaNV && formik.errors.MaNV}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.MaNV} value={employee.MaNV}>
                      {employee.HoTen}
                    </MenuItem>
                  ))}
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
                  select
                  name="VaiTro"
                  label="Vai trò"
                  value={formik.values.VaiTro}
                  onChange={formik.handleChange}
                  error={formik.touched.VaiTro && Boolean(formik.errors.VaiTro)}
                  helperText={formik.touched.VaiTro && formik.errors.VaiTro}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Quản lý">Quản lý</MenuItem>
                  <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="TrangThai"
                  label="Trạng thái"
                  value={formik.values.TrangThai}
                  onChange={(e) => formik.setFieldValue('TrangThai', e.target.value === 'true')}
                  error={formik.touched.TrangThai && Boolean(formik.errors.TrangThai)}
                  helperText={formik.touched.TrangThai && formik.errors.TrangThai}
                >
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Khóa</MenuItem>
                </TextField>
              </Grid>
            </Grid>
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

export default AccountManagement; 