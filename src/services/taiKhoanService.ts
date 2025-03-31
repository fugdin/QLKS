import axios from 'axios';
import { TaiKhoan, LoginRequest } from '../types';

const API_URL = 'http://localhost:5253/api';

const taiKhoanService = {
  getAllTaiKhoans: async (): Promise<TaiKhoan[]> => {
    const response = await axios.get(`${API_URL}/TaiKhoan`);
    return response.data;
  },

  getTaiKhoanById: async (id: string): Promise<TaiKhoan> => {
    const response = await axios.get(`${API_URL}/TaiKhoan/${id}`);
    return response.data;
  },

  register: async (taiKhoan: Omit<TaiKhoan, 'MaTK' | 'NgayTao' | 'TrangThai'>): Promise<TaiKhoan> => {
    const response = await axios.post(`${API_URL}/TaiKhoan/register`, taiKhoan);
    return response.data;
  },

  login: async (loginRequest: LoginRequest): Promise<TaiKhoan> => {
    const response = await axios.post(`${API_URL}/TaiKhoan/login`, loginRequest);
    return response.data;
  },

  updateTaiKhoan: async (id: string, taiKhoan: Partial<TaiKhoan>): Promise<TaiKhoan> => {
    const response = await axios.put(`${API_URL}/TaiKhoan/${id}`, taiKhoan);
    return response.data;
  },

  deleteTaiKhoan: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/TaiKhoan/${id}`);
  },
};

export default taiKhoanService; 