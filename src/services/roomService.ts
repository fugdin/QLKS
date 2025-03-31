import axios from 'axios';
import { Phong, LoaiPhong } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

const roomService = {
  getAllRooms: async (): Promise<Phong[]> => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  },

  getRoomById: async (id: string): Promise<Phong> => {
    const response = await axios.get(`${API_URL}/rooms/${id}`);
    return response.data;
  },

  createRoom: async (room: Omit<Phong, 'MaPhong'>): Promise<Phong> => {
    const response = await axios.post(`${API_URL}/rooms`, room);
    return response.data;
  },

  updateRoom: async (id: string, room: Partial<Phong>): Promise<Phong> => {
    const response = await axios.put(`${API_URL}/rooms/${id}`, room);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/rooms/${id}`);
  },

  getAllRoomTypes: async (): Promise<LoaiPhong[]> => {
    const response = await axios.get(`${API_URL}/room-types`);
    return response.data;
  },
};

export default roomService; 