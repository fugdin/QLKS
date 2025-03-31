import axios from 'axios';
import { UserPermissions, getPermissionsFromRole } from '../utils/permissions';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5253/api';

export interface LoginResponse {
  token: string;
  user: {
    MaTK: string;
    TenDangNhap: string;
    quyenTruyCap: string;
    MaNV?: string;
    MaKH?: string;
    MaVaitro: string;
  };
  permissions: UserPermissions;
}

const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
        return response.data;
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        // Server trả về lỗi
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.');
      } else {
        // Lỗi khi tạo request
        throw new Error('Có lỗi xảy ra khi đăng nhập');
      }
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getCurrentPermissions(): UserPermissions | null {
    const permissionsStr = localStorage.getItem('permissions');
    if (permissionsStr) return JSON.parse(permissionsStr);
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService; 