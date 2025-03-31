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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import roomService from '../services/roomService';
import { Phong, LoaiPhong } from '../types';

const validationSchema = yup.object({
  TenPhong: yup.string().required('Vui lòng nhập tên phòng'),
  MaLoaiPhong: yup.string().required('Vui lòng chọn loại phòng'),
  TrangThai: yup.string().required('Vui lòng chọn trạng thái'),
  GhiChu: yup.string(),
});

const roomStatuses = [
  { value: 'Trống', label: 'Trống' },
  { value: 'Đã đặt', label: 'Đã đặt' },
  { value: 'Đang sử dụng', label: 'Đang sử dụng' },
  { value: 'Đang bảo trì', label: 'Đang bảo trì' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Trống':
      return 'success';
    case 'Đã đặt':
      return 'warning';
    case 'Đang sử dụng':
      return 'info';
    case 'Đang bảo trì':
      return 'error';
    default:
      return 'default';
  }
};

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Phong[]>([]);
  const [roomTypes, setRoomTypes] = useState<LoaiPhong[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Phong | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const data = await roomService.getAllRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleOpen = (room?: Phong) => {
    if (room) {
      setSelectedRoom(room);
      setIsEdit(true);
    } else {
      setSelectedRoom(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      TenPhong: selectedRoom?.TenPhong || '',
      MaLoaiPhong: selectedRoom?.MaLoaiPhong || '',
      TrangThai: selectedRoom?.TrangThai || '',
      GhiChu: selectedRoom?.GhiChu || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit && selectedRoom) {
          await roomService.updateRoom(selectedRoom.MaPhong, values);
        } else {
          await roomService.createRoom(values);
        }
        handleClose();
        fetchRooms();
      } catch (error) {
        console.error('Error saving room:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Phòng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm phòng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã phòng</TableCell>
              <TableCell>Tên phòng</TableCell>
              <TableCell>Loại phòng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.MaPhong}>
                <TableCell>{room.MaPhong}</TableCell>
                <TableCell>{room.TenPhong}</TableCell>
                <TableCell>
                  {roomTypes.find((type) => type.MaLoaiPhong === room.MaLoaiPhong)?.TenLoai}
                </TableCell>
                <TableCell>
                  <Chip
                    label={room.TrangThai}
                    color={getStatusColor(room.TrangThai)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{room.GhiChu}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(room)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(room.MaPhong)}
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
          {isEdit ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="TenPhong"
              label="Tên phòng"
              value={formik.values.TenPhong}
              onChange={formik.handleChange}
              error={formik.touched.TenPhong && Boolean(formik.errors.TenPhong)}
              helperText={formik.touched.TenPhong && formik.errors.TenPhong}
            />
            <TextField
              fullWidth
              margin="normal"
              name="MaLoaiPhong"
              label="Loại phòng"
              select
              value={formik.values.MaLoaiPhong}
              onChange={formik.handleChange}
              error={formik.touched.MaLoaiPhong && Boolean(formik.errors.MaLoaiPhong)}
              helperText={formik.touched.MaLoaiPhong && formik.errors.MaLoaiPhong}
            >
              {roomTypes.map((type) => (
                <MenuItem key={type.MaLoaiPhong} value={type.MaLoaiPhong}>
                  {type.TenLoai}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="TrangThai"
              label="Trạng thái"
              select
              value={formik.values.TrangThai}
              onChange={formik.handleChange}
              error={formik.touched.TrangThai && Boolean(formik.errors.TrangThai)}
              helperText={formik.touched.TrangThai && formik.errors.TrangThai}
            >
              {roomStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="GhiChu"
              label="Ghi chú"
              multiline
              rows={3}
              value={formik.values.GhiChu}
              onChange={formik.handleChange}
              error={formik.touched.GhiChu && Boolean(formik.errors.GhiChu)}
              helperText={formik.touched.GhiChu && formik.errors.GhiChu}
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

export default RoomManagement; 