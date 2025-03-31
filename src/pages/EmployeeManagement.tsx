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
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import employeeService from '../services/employeeService';
import { NhanVien } from '../types';

const validationSchema = yup.object({
  HoTen: yup.string().required('Vui lòng nhập họ tên'),
  Email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  SoDienThoai: yup.string().required('Vui lòng nhập số điện thoại'),
  DiaChi: yup.string().required('Vui lòng nhập địa chỉ'),
  NgaySinh: yup.date().required('Vui lòng chọn ngày sinh'),
  GioiTinh: yup.string().required('Vui lòng chọn giới tính'),
  ChucVu: yup.string().required('Vui lòng chọn chức vụ'),
  NgayVaoLam: yup.date().required('Vui lòng chọn ngày vào làm'),
  Luong: yup.number().required('Vui lòng nhập lương').positive('Lương phải là số dương'),
  TrangThai: yup.string().required('Vui lòng chọn trạng thái'),
  GhiChu: yup.string(),
});

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<NhanVien[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<NhanVien | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpen = (employee?: NhanVien) => {
    if (employee) {
      setSelectedEmployee(employee);
      setIsEdit(true);
    } else {
      setSelectedEmployee(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      HoTen: selectedEmployee?.HoTen || '',
      Email: selectedEmployee?.Email || '',
      SoDienThoai: selectedEmployee?.SoDienThoai || '',
      DiaChi: selectedEmployee?.DiaChi || '',
      NgaySinh: selectedEmployee?.NgaySinh ? new Date(selectedEmployee.NgaySinh) : new Date(),
      GioiTinh: selectedEmployee?.GioiTinh || 'Nam',
      ChucVu: selectedEmployee?.ChucVu || 'Nhân viên',
      NgayVaoLam: selectedEmployee?.NgayVaoLam ? new Date(selectedEmployee.NgayVaoLam) : new Date(),
      Luong: selectedEmployee?.Luong || 0,
      TrangThai: selectedEmployee?.TrangThai || 'Đang làm việc',
      GhiChu: selectedEmployee?.GhiChu || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const employeeData = {
          MaNV: selectedEmployee?.MaNV || '',
          ...values,
          NgaySinh: values.NgaySinh.toISOString(),
          NgayVaoLam: values.NgayVaoLam.toISOString(),
        };

        if (isEdit && selectedEmployee) {
          await employeeService.updateEmployee(selectedEmployee.MaNV, employeeData);
        } else {
          await employeeService.createEmployee(employeeData);
        }
        handleClose();
        fetchEmployees();
      } catch (error) {
        console.error('Error saving employee:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      if (query.trim()) {
        const results = await employeeService.searchEmployees(query);
        setEmployees(results);
      } else {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang làm việc':
        return 'success';
      case 'Nghỉ việc':
        return 'error';
      case 'Tạm nghỉ':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.SoDienThoai.toString().includes(searchQuery)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Nhân Viên</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm nhân viên
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã NV</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.MaNV}>
                <TableCell>{employee.MaNV}</TableCell>
                <TableCell>{employee.HoTen}</TableCell>
                <TableCell>{employee.Email}</TableCell>
                <TableCell>{employee.SoDienThoai}</TableCell>
                <TableCell>{employee.ChucVu}</TableCell>
                <TableCell>{employee.Luong.toLocaleString()}đ</TableCell>
                <TableCell>
                  <Chip
                    label={employee.TrangThai}
                    color={getStatusColor(employee.TrangThai)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(employee)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employee.MaNV)}
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
          {isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày sinh"
                    value={formik.values.NgaySinh}
                    onChange={(date) => formik.setFieldValue('NgaySinh', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.NgaySinh && Boolean(formik.errors.NgaySinh),
                        helperText: formik.touched.NgaySinh && formik.errors.NgaySinh ? String(formik.errors.NgaySinh) : ''
                      }
                    }}
                  />
                </LocalizationProvider>
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
                  <MenuItem value="Quản lý">Quản lý</MenuItem>
                  <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                  <MenuItem value="Lễ tân">Lễ tân</MenuItem>
                  <MenuItem value="Bảo vệ">Bảo vệ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày vào làm"
                    value={formik.values.NgayVaoLam}
                    onChange={(date) => formik.setFieldValue('NgayVaoLam', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.NgayVaoLam && Boolean(formik.errors.NgayVaoLam),
                        helperText: formik.touched.NgayVaoLam && formik.errors.NgayVaoLam ? String(formik.errors.NgayVaoLam) : ''
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="Luong"
                  label="Lương"
                  type="number"
                  value={formik.values.Luong}
                  onChange={formik.handleChange}
                  error={formik.touched.Luong && Boolean(formik.errors.Luong)}
                  helperText={formik.touched.Luong && formik.errors.Luong}
                  InputProps={{
                    endAdornment: 'đ',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="TrangThai"
                  label="Trạng thái"
                  value={formik.values.TrangThai}
                  onChange={formik.handleChange}
                  error={formik.touched.TrangThai && Boolean(formik.errors.TrangThai)}
                  helperText={formik.touched.TrangThai && formik.errors.TrangThai}
                >
                  <MenuItem value="Đang làm việc">Đang làm việc</MenuItem>
                  <MenuItem value="Đã nghỉ việc">Đã nghỉ việc</MenuItem>
                  <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="GhiChu"
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={formik.values.GhiChu}
                  onChange={formik.handleChange}
                  error={formik.touched.GhiChu && Boolean(formik.errors.GhiChu)}
                  helperText={formik.touched.GhiChu && formik.errors.GhiChu}
                />
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

export default EmployeeManagement; 