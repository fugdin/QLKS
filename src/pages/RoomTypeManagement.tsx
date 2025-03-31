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
import roomTypeService from '../services/roomTypeService';
import { LoaiPhong } from '../types';

const validationSchema = yup.object({
  TenLoai: yup.string().required('Vui lòng nhập tên loại phòng'),
  MoTa: yup.string().required('Vui lòng nhập mô tả'),
  GiaCoBan: yup
    .number()
    .required('Vui lòng nhập giá cơ bản')
    .positive('Giá cơ bản phải là số dương'),
});

const RoomTypeManagement: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<LoaiPhong[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<LoaiPhong | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchRoomTypes = async () => {
    try {
      const data = await roomTypeService.getAllRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleOpen = (roomType?: LoaiPhong) => {
    if (roomType) {
      setSelectedRoomType(roomType);
      setIsEdit(true);
    } else {
      setSelectedRoomType(null);
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoomType(null);
    setIsEdit(false);
  };

  const formik = useFormik({
    initialValues: {
      TenLoai: selectedRoomType?.TenLoai || '',
      MoTa: selectedRoomType?.MoTa || '',
      GiaCoBan: selectedRoomType?.GiaCoBan || 0,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const roomTypeData = {
          ...values,
          GiaCoBan: Number(values.GiaCoBan) || 0
        };

        if (isEdit && selectedRoomType) {
          await roomTypeService.updateRoomType(selectedRoomType.MaLoaiPhong, roomTypeData);
        } else {
          await roomTypeService.createRoomType(roomTypeData);
        }
        handleClose();
        fetchRoomTypes();
      } catch (error) {
        console.error('Error saving room type:', error);
      }
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      try {
        await roomTypeService.deleteRoomType(id);
        fetchRoomTypes();
      } catch (error) {
        console.error('Error deleting room type:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Loại Phòng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm loại phòng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã loại phòng</TableCell>
              <TableCell>Tên loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá cơ bản</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomTypes.map((roomType) => (
              <TableRow key={roomType.MaLoaiPhong}>
                <TableCell>{roomType.MaLoaiPhong}</TableCell>
                <TableCell>{roomType.TenLoai}</TableCell>
                <TableCell>{roomType.MoTa}</TableCell>
                <TableCell>
                  {typeof roomType.GiaCoBan === 'number' 
                    ? roomType.GiaCoBan.toLocaleString() + 'đ'
                    : '0đ'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(roomType)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(roomType.MaLoaiPhong)}
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
          {isEdit ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="TenLoai"
              label="Tên loại phòng"
              value={formik.values.TenLoai}
              onChange={formik.handleChange}
              error={formik.touched.TenLoai && Boolean(formik.errors.TenLoai)}
              helperText={formik.touched.TenLoai && formik.errors.TenLoai}
            />
            <TextField
              fullWidth
              margin="normal"
              name="MoTa"
              label="Mô tả"
              multiline
              rows={3}
              value={formik.values.MoTa}
              onChange={formik.handleChange}
              error={formik.touched.MoTa && Boolean(formik.errors.MoTa)}
              helperText={formik.touched.MoTa && formik.errors.MoTa}
            />
            <TextField
              fullWidth
              margin="normal"
              name="GiaCoBan"
              label="Giá cơ bản"
              type="number"
              value={formik.values.GiaCoBan}
              onChange={formik.handleChange}
              error={formik.touched.GiaCoBan && Boolean(formik.errors.GiaCoBan)}
              helperText={formik.touched.GiaCoBan && formik.errors.GiaCoBan}
              InputProps={{
                endAdornment: 'đ',
              }}
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

export default RoomTypeManagement; 