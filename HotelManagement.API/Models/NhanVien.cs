using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models;

public class NhanVien
{
    [Key]
    public string MaNV { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SoDienThoai { get; set; } = string.Empty;
    public string DiaChi { get; set; } = string.Empty;
    public DateTime NgaySinh { get; set; }
    public string GioiTinh { get; set; } = string.Empty;
    public string ChucVu { get; set; } = string.Empty;
    public DateTime NgayVaoLam { get; set; }
    public decimal Luong { get; set; }
    public bool TrangThai { get; set; }
    public string? GhiChu { get; set; }
}