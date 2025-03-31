namespace HotelManagement.API.Models;

public class LoaiPhong
{
    public string MaLoaiPhong { get; set; } = string.Empty;
    public string TenLoai { get; set; } = string.Empty;
    public string MoTa { get; set; } = string.Empty;
    public decimal GiaCoBan { get; set; }
}