import axios from 'axios';
import { NhanVien } from '../types';

const API_URL = 'http://localhost:5253/api';

const nhanVienService = {
  getAllNhanViens: async (): Promise<NhanVien[]> => {
    const response = await axios.get(`${API_URL}/NhanVien`);
    return response.data;
  },

  getNhanVienById: async (id: string): Promise<NhanVien> => {
    const response = await axios.get(`${API_URL}/NhanVien/${id}`);
    return response.data;
  },

  createNhanVien: async (nhanVien: Omit<NhanVien, 'MaNV'>): Promise<NhanVien> => {
    const response = await axios.post(`${API_URL}/NhanVien`, nhanVien);
    return response.data;
  },

  updateNhanVien: async (id: string, nhanVien: Partial<NhanVien>): Promise<NhanVien> => {
    const response = await axios.put(`${API_URL}/NhanVien/${id}`, nhanVien);
    return response.data;
  },

  deleteNhanVien: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/NhanVien/${id}`);
  },
};

export default nhanVienService; 