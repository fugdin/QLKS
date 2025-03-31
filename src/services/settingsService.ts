import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

interface SystemSettings {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  checkInTime: string;
  checkOutTime: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark';
}

const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await axios.put(`${API_URL}/settings`, settings);
    return response.data;
  },

  resetSettings: async (): Promise<SystemSettings> => {
    const response = await axios.post(`${API_URL}/settings/reset`);
    return response.data;
  }
};

export default settingsService; 