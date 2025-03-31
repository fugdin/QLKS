import axios from 'axios';
import { DatPhong } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

const bookingService = {
  getAllBookings: async (): Promise<DatPhong[]> => {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  },

  getBookingById: async (id: string): Promise<DatPhong> => {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return response.data;
  },

  createBooking: async (booking: Omit<DatPhong, 'MaDatPhong'>): Promise<DatPhong> => {
    const response = await axios.post(`${API_URL}/bookings`, booking);
    return response.data;
  },

  updateBooking: async (id: string, booking: Partial<DatPhong>): Promise<DatPhong> => {
    const response = await axios.put(`${API_URL}/bookings/${id}`, booking);
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/bookings/${id}`);
  },

  // Additional methods for booking management
  getBookingsByCustomer: async (customerId: string): Promise<DatPhong[]> => {
    const response = await axios.get(`${API_URL}/bookings/customer/${customerId}`);
    return response.data;
  },

  getBookingsByRoom: async (roomId: string): Promise<DatPhong[]> => {
    const response = await axios.get(`${API_URL}/bookings/room/${roomId}`);
    return response.data;
  },

  getBookingsByDateRange: async (startDate: string, endDate: string): Promise<DatPhong[]> => {
    const response = await axios.get(`${API_URL}/bookings/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

export default bookingService; 