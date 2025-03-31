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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import billService from '../services/billService';
import customerService from '../services/customerService';
import bookingService from '../services/bookingService';
import { HoaDon, KhachHang, DatPhong } from '../types';

const validationSchema = yup.object({
  MaKhachHang: yup.string().required('Vui lòng chọn khách hàng'),
  MaDatPhong: yup.string().required('Vui lòng chọn đặt phòng'),
  NgayLap: yup.date().required('Vui lòng chọn ngày lập'),
  TongTien: yup
    .number()
    .required('Vui lòng nhập tổng tiền')
    .positive('Tổng tiền phải là số dương'),
  TrangThai: yup.string().required('Vui lòng chọn trạng thái'),
  GhiChu: yup.string(),
});

const BillManagement: React.FC = () => {
  const [bills, setBills] = useState<HoaDon[]>([]);
  const [customers, setCustomers] = useState<KhachHang[]>([]);
  const [bookings, setBookings] = useState<DatPhong[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<HoaDon | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = async () => {
    try {
      const [billsData, customersData, bookingsData] = await Promise.all([
        billService.getAllBills(),
        customerService.getAllCustomers(),
        bookingService.getAllBookings(),
      ]);
      setBills(billsData);
      setCustomers(customersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (bill?: HoaDon) => {
    if (bill) {
      setSelectedBill(bill);
      setIsEdit(true);
    } else {
      setSelectedBill(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBill(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      MaKH: selectedBill?.MaKH || '',
      MaDatPhong: selectedBill?.MaDatPhong || '',
      NgayLap: selectedBill?.NgayLap ? new Date(selectedBill.NgayLap) : new Date(),
      TongTien: selectedBill?.TongTien || 0,
      TrangThai: selectedBill?.TrangThai || 'Chưa thanh toán',
      GhiChu: selectedBill?.GhiChu || '',
      MaNVLap: selectedBill?.MaNVLap || '',
      PTTHANHTOAN: selectedBill?.PTTHANHTOAN || 'Tiền mặt'
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const billData = {
          ...values,
          NgayLap: values.NgayLap || new Date(),
          TongTien: Number(values.TongTien)
        };
        if (isEdit && selectedBill) {
          await billService.updateBill(selectedBill.MaHoaDon, billData);
        } else {
          await billService.createBill(billData);
        }
        handleClose();
        fetchData();
      } catch (error) {
        console.error('Error saving bill:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await billService.deleteBill(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.MaKH === customerId);
    return customer ? customer.HoTen : '';
  };

  const getBookingInfo = (bookingId: string) => {
    const booking = bookings.find(b => b.MaDatPhong === bookingId);
    return booking ? `${booking.MaDatPhong} (${new Date(booking.NgayDat).toLocaleDateString()})` : '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return 'success';
      case 'Chưa thanh toán':
        return 'warning';
      case 'Đã hủy':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Hóa Đơn</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm hóa đơn
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Đặt phòng</TableCell>
              <TableCell>Ngày lập</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.MaHoaDon}>
                <TableCell>{bill.MaHoaDon}</TableCell>
                <TableCell>{getCustomerName(bill.MaKH)}</TableCell>
                <TableCell>{getBookingInfo(bill.MaDatPhong)}</TableCell>
                <TableCell>{new Date(bill.NgayLap).toLocaleDateString()}</TableCell>
                <TableCell>{bill.TongTien.toLocaleString('vi-VN')} VNĐ</TableCell>
                <TableCell>
                  <Chip
                    label={bill.TrangThai}
                    color={getStatusColor(bill.TrangThai)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{bill.GhiChu}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(bill)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(bill.MaHoaDon)}
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
          {isEdit ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="MaKhachHang"
                  label="Khách hàng"
                  value={formik.values.MaKH}
                  onChange={formik.handleChange}
                  error={formik.touched.MaKH && Boolean(formik.errors.MaKH)}
                  helperText={formik.touched.MaKH && formik.errors.MaKH}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.MaKH} value={customer.MaKH}>
                      {customer.HoTen}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="MaDatPhong"
                  label="Đặt phòng"
                  value={formik.values.MaDatPhong}
                  onChange={formik.handleChange}
                  error={formik.touched.MaDatPhong && Boolean(formik.errors.MaDatPhong)}
                  helperText={formik.touched.MaDatPhong && formik.errors.MaDatPhong}
                >
                  {bookings.map((booking) => (
                    <MenuItem key={booking.MaDatPhong} value={booking.MaDatPhong}>
                      {getBookingInfo(booking.MaDatPhong)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày lập"
                    value={formik.values.NgayLap}
                    onChange={(date) => formik.setFieldValue('NgayLap', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.NgayLap && Boolean(formik.errors.NgayLap),
                        helperText: formik.touched.NgayLap && formik.errors.NgayLap ? String(formik.errors.NgayLap) : ''
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="TongTien"
                  label="Tổng tiền"
                  type="number"
                  value={formik.values.TongTien}
                  onChange={formik.handleChange}
                  error={formik.touched.TongTien && Boolean(formik.errors.TongTien)}
                  helperText={formik.touched.TongTien && formik.errors.TongTien}
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
                  <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
                  <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
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

export default BillManagement; 