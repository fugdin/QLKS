import axios from 'axios';
import { LoaiPhong } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

const roomTypeService = {
  getAllRoomTypes: async (): Promise<LoaiPhong[]> => {
    const response = await axios.get(`${API_URL}/RoomType`);
    return response.data;
  },

  getRoomTypeById: async (id: string): Promise<LoaiPhong> => {
    const response = await axios.get(`${API_URL}/RoomType/${id}`);
    return response.data;
  },

  createRoomType: async (roomType: Omit<LoaiPhong, 'MaLoaiPhong'>): Promise<LoaiPhong> => {
    const response = await axios.post(`${API_URL}/RoomType`, roomType);
    return response.data;
  },

  updateRoomType: async (id: string, roomType: Partial<LoaiPhong>): Promise<LoaiPhong> => {
    const response = await axios.put(`${API_URL}/RoomType/${id}`, roomType);
    return response.data;
  },

  deleteRoomType: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/RoomType/${id}`);
  },
};

export default roomTypeService; 