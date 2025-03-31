export interface KhachHang {
  MaKH: string;
  HoTen: string;
  CMND_CCCD: number;
  DiaChi: string;
  SoDienThoai: number;
  Email: string;
}

export interface NhanVien {
  MaNV: string;
  HoTen: string;
  Email: string;
  SoDienThoai: string;
  DiaChi: string;
  NgaySinh: string;
  GioiTinh: string;
  ChucVu: string;
  NgayVaoLam: string;
  Luong: number;
  TrangThai: string;
  GhiChu: string;
}

export interface VaiTro {
  ID: number;
  TenVaiTro: string;
}

export interface ChucNang {
  MaChucNang: string;
  TenChucNang: string;
  KiHieu: string;
  NhomChucNang: string;
  IsDelete: string;
}

export interface VaiTro_ChucNang {
  MaVaiTro: string;
  MaChucNang: string;
  TongQuyen: number;
}

export interface TaiKhoan {
  MaTK: string;
  MaNV: string;
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
  TrangThai: boolean;
  NgayTao: string;
  NgayDangNhapCuoi?: string;
}

export interface LoginRequest {
  TenDangNhap: string;
  MatKhau: string;
}

export interface LoaiPhong {
  MaLoaiPhong: string;
  TenLoai: string;
  MoTa: string;
  GiaCoBan: number;
}

export interface Phong {
  MaPhong: string;
  TenPhong: string;
  MaLoaiPhong: string;
  TrangThai: string;
  GhiChu: string;
}

export interface DatPhong {
  MaDatPhong: string;
  MaKH: string;
  MaPhong: string;
  NgayDat: Date;
  NgayTra: Date;
  SoNguoi: number;
  GhiChu: string;
  TrangThai: string;
  MaNV: string;
}

export interface ChiTietDatPhong {
  MaDatPhong: string;
  MaPhong: string;
  SoLuongNguoi: number;
  MaDV: string;
  SoLuong: number;
  ThanhTien: number;
}

export interface DichVu {
  MaDV: string;
  TenDV: string;
  MoTa: string;
  DonGia: number;
}

export interface ChiTietDichVu {
  MaDV: string;
  MaCTDP: string;
  SoLuongDV: number;
  DonGiaDV: number;
  ThanhtienDV: number;
}

export interface HoaDon {
  MaHoaDon: string;
  MaKH: string;
  MaDatPhong: string;
  NgayLap: Date;
  TongTien: number;
  TrangThai: string;
  GhiChu: string;
  MaNVLap: string;
  PTTHANHTOAN: string;
} 