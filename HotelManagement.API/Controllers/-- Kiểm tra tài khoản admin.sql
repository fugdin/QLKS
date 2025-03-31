-- Kiểm tra tài khoản admin
SELECT * FROM TAIKHOAN WHERE TenDangNhap = 'admin';
-- Kiểm tra nhân viên admin
SELECT * FROM NHANVIEN WHERE MaNV = 'ADMIN001';

SELECT vc.*, v.TENVAITRO, c.TenChucNang 
FROM VAITRO_CHUCNANG vc
JOIN VAITRO v ON vc.MaVaitro = v.ID
JOIN CHUCNANG c ON vc.MaChucNang = c.MaChucNang
WHERE vc.MaVaitro = 'ADMIN';