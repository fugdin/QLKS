namespace HotelManagement.API.Models;

public class TaiKhoan
{
    public string MaTK { get; set; } = string.Empty;
    public string MaNV { get; set; } = string.Empty;
    public string TenDangNhap { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
    public bool TrangThai { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime? NgayDangNhapCuoi { get; set; }
}