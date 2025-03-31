namespace HotelManagement.API.Models;

public class KhachHang
{
    public string MaKH { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public long CMND_CCCD { get; set; }
    public string DiaChi { get; set; } = string.Empty;
    public long SoDienThoai { get; set; }
    public string Email { get; set; } = string.Empty;
}