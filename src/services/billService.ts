import axios from 'axios';
import { HoaDon } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

const billService = {
  getAllBills: async (): Promise<HoaDon[]> => {
    const response = await axios.get(`${API_URL}/bills`);
    return response.data;
  },

  getBillById: async (id: string): Promise<HoaDon> => {
    const response = await axios.get(`${API_URL}/bills/${id}`);
    return response.data;
  },

  createBill: async (bill: Omit<HoaDon, 'MaHoaDon'>): Promise<HoaDon> => {
    const response = await axios.post(`${API_URL}/bills`, bill);
    return response.data;
  },

  updateBill: async (id: string, bill: Partial<HoaDon>): Promise<HoaDon> => {
    const response = await axios.put(`${API_URL}/bills/${id}`, bill);
    return response.data;
  },

  deleteBill: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/bills/${id}`);
  },

  // Additional methods for bill management
  getBillsByCustomer: async (customerId: string): Promise<HoaDon[]> => {
    const response = await axios.get(`${API_URL}/bills/customer/${customerId}`);
    return response.data;
  },

  getBillsByDateRange: async (startDate: string, endDate: string): Promise<HoaDon[]> => {
    const response = await axios.get(`${API_URL}/bills/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  calculateTotalAmount: async (billId: string): Promise<number> => {
    const response = await axios.get(`${API_URL}/bills/${billId}/total`);
    return response.data.total;
  }
};

export default billService; 