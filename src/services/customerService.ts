import axios from 'axios';
import { KhachHang } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

const customerService = {
  getAllCustomers: async (): Promise<KhachHang[]> => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  },

  getCustomerById: async (id: string): Promise<KhachHang> => {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: Omit<KhachHang, 'MaKH'>): Promise<KhachHang> => {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  },

  updateCustomer: async (id: string, customer: Partial<KhachHang>): Promise<KhachHang> => {
    const response = await axios.put(`${API_URL}/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/customers/${id}`);
  },
};

export default customerService; 