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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import bookingService from '../services/bookingService';
import customerService from '../services/customerService';
import roomService from '../services/roomService';
import { DatPhong, KhachHang, Phong } from '../types';

const validationSchema = yup.object({
  MaKH: yup.string().required('Vui lòng chọn khách hàng'),
  MaPhong: yup.string().required('Vui lòng chọn phòng'),
  NgayDat: yup.date().required('Vui lòng chọn ngày đặt'),
  NgayTra: yup
    .date()
    .required('Vui lòng chọn ngày trả')
    .min(yup.ref('NgayDat'), 'Ngày trả phải sau ngày đặt'),
  SoNguoi: yup
    .number()
    .required('Vui lòng nhập số người')
    .positive('Số người phải là số dương')
    .integer('Số người phải là số nguyên'),
  GhiChu: yup.string(),
});

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<DatPhong[]>([]);
  const [customers, setCustomers] = useState<KhachHang[]>([]);
  const [rooms, setRooms] = useState<Phong[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<DatPhong | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = async () => {
    try {
      const [bookingsData, customersData, roomsData] = await Promise.all([
        bookingService.getAllBookings(),
        customerService.getAllCustomers(),
        roomService.getAllRooms(),
      ]);
      setBookings(bookingsData);
      setCustomers(customersData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (booking?: DatPhong) => {
    if (booking) {
      setSelectedBooking(booking);
      setIsEdit(true);
    } else {
      setSelectedBooking(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      MaKH: selectedBooking?.MaKH || '',
      MaPhong: selectedBooking?.MaPhong || '',
      NgayDat: selectedBooking?.NgayDat ? new Date(selectedBooking.NgayDat) : new Date(),
      NgayTra: selectedBooking?.NgayTra ? new Date(selectedBooking.NgayTra) : new Date(),
      SoNguoi: selectedBooking?.SoNguoi || 1,
      GhiChu: selectedBooking?.GhiChu || '',
      TrangThai: selectedBooking?.TrangThai || 'Chờ xác nhận',
      MaNV: selectedBooking?.MaNV || ''
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const bookingData = {
          ...values,
          NgayDat: values.NgayDat || new Date(),
          NgayTra: values.NgayTra || new Date(),
          SoNguoi: Number(values.SoNguoi)
        };
        if (isEdit && selectedBooking) {
          await bookingService.updateBooking(selectedBooking.MaDatPhong, bookingData);
        } else {
          await bookingService.createBooking(bookingData);
        }
        handleClose();
        fetchData();
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt phòng này?')) {
      try {
        await bookingService.deleteBooking(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.MaKH === customerId);
    return customer ? customer.HoTen : '';
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.MaPhong === roomId);
    return room ? room.TenPhong : '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Đặt Phòng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm đặt phòng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đặt phòng</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Ngày trả</TableCell>
              <TableCell>Số người</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.MaDatPhong}>
                <TableCell>{booking.MaDatPhong}</TableCell>
                <TableCell>{getCustomerName(booking.MaKH)}</TableCell>
                <TableCell>{getRoomName(booking.MaPhong)}</TableCell>
                <TableCell>{new Date(booking.NgayDat).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.NgayTra).toLocaleDateString()}</TableCell>
                <TableCell>{booking.SoNguoi}</TableCell>
                <TableCell>{booking.GhiChu}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(booking)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(booking.MaDatPhong)}
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
          {isEdit ? 'Chỉnh sửa đặt phòng' : 'Thêm đặt phòng mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="MaKH"
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
                  name="MaPhong"
                  label="Phòng"
                  value={formik.values.MaPhong}
                  onChange={formik.handleChange}
                  error={formik.touched.MaPhong && Boolean(formik.errors.MaPhong)}
                  helperText={formik.touched.MaPhong && formik.errors.MaPhong}
                >
                  {rooms.map((room) => (
                    <MenuItem key={room.MaPhong} value={room.MaPhong}>
                      {room.TenPhong}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày đặt"
                    value={formik.values.NgayDat}
                    onChange={(date) => formik.setFieldValue('NgayDat', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.NgayDat && Boolean(formik.errors.NgayDat),
                        helperText: formik.touched.NgayDat && formik.errors.NgayDat ? String(formik.errors.NgayDat) : ''
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày trả"
                    value={formik.values.NgayTra}
                    onChange={(date) => formik.setFieldValue('NgayTra', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.NgayTra && Boolean(formik.errors.NgayTra),
                        helperText: formik.touched.NgayTra && formik.errors.NgayTra ? String(formik.errors.NgayTra) : ''
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="SoNguoi"
                  label="Số người"
                  type="number"
                  value={formik.values.SoNguoi}
                  onChange={formik.handleChange}
                  error={formik.touched.SoNguoi && Boolean(formik.errors.SoNguoi)}
                  helperText={formik.touched.SoNguoi && formik.errors.SoNguoi}
                />
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

export default BookingManagement; 