import axios from 'axios';
import { NhanVien } from '../types';

const API_URL = 'http://localhost:5253/api';

const employeeService = {
  getAllEmployees: async (): Promise<NhanVien[]> => {
    const response = await axios.get(`${API_URL}/NhanVien`);
    return response.data;
  },

  getEmployeeById: async (id: string): Promise<NhanVien> => {
    const response = await axios.get(`${API_URL}/NhanVien/${id}`);
    return response.data;
  },

  createEmployee: async (employee: Omit<NhanVien, 'MaNV'>): Promise<NhanVien> => {
    const response = await axios.post(`${API_URL}/NhanVien`, employee);
    return response.data;
  },

  updateEmployee: async (id: string, employee: NhanVien): Promise<void> => {
    await axios.put(`${API_URL}/NhanVien/${id}`, employee);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/NhanVien/${id}`);
  },

  // Additional methods for employee management
  getEmployeesByRole: async (role: string): Promise<NhanVien[]> => {
    const response = await axios.get(`${API_URL}/employees/role/${role}`);
    return response.data;
  },

  searchEmployees: async (query: string): Promise<NhanVien[]> => {
    const response = await axios.get(`${API_URL}/employees/search`, {
      params: { query }
    });
    return response.data;
  }
};

export default employeeService; 