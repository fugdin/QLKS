using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaiKhoanController : ControllerBase
{
    private readonly ILogger<TaiKhoanController> _logger;
    private static List<TaiKhoan> _taiKhoans = new List<TaiKhoan>();
    private static int _nextId = 1;

    public TaiKhoanController(ILogger<TaiKhoanController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAllTaiKhoans()
    {
        return Ok(_taiKhoans);
    }

    [HttpGet("{id}")]
    public IActionResult GetTaiKhoanById(string id)
    {
        var taiKhoan = _taiKhoans.FirstOrDefault(t => t.MaTK == id);
        if (taiKhoan == null)
        {
            return NotFound();
        }
        return Ok(taiKhoan);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] TaiKhoan taiKhoan)
    {
        try
        {
            if (string.IsNullOrEmpty(taiKhoan.TenDangNhap) || string.IsNullOrEmpty(taiKhoan.MatKhau))
            {
                return BadRequest(new { message = "Tên đăng nhập và mật khẩu không được để trống" });
            }

            if (_taiKhoans.Any(t => t.TenDangNhap == taiKhoan.TenDangNhap))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            taiKhoan.MaTK = $"TK{_nextId++}";
            taiKhoan.NgayTao = DateTime.Now;
            taiKhoan.TrangThai = true;
            _taiKhoans.Add(taiKhoan);

            return CreatedAtAction(nameof(GetTaiKhoanById), new { id = taiKhoan.MaTK }, taiKhoan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering account");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            var taiKhoan = _taiKhoans.FirstOrDefault(t =>
                t.TenDangNhap == request.TenDangNhap &&
                t.MatKhau == request.MatKhau &&
                t.TrangThai);

            if (taiKhoan == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            taiKhoan.NgayDangNhapCuoi = DateTime.Now;
            return Ok(taiKhoan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTaiKhoan(string id, [FromBody] TaiKhoan taiKhoan)
    {
        try
        {
            var existingTaiKhoan = _taiKhoans.FirstOrDefault(t => t.MaTK == id);
            if (existingTaiKhoan == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(taiKhoan.MatKhau))
            {
                existingTaiKhoan.MatKhau = taiKhoan.MatKhau;
            }

            existingTaiKhoan.VaiTro = taiKhoan.VaiTro;
            existingTaiKhoan.TrangThai = taiKhoan.TrangThai;

            return Ok(existingTaiKhoan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating account");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTaiKhoan(string id)
    {
        try
        {
            var taiKhoan = _taiKhoans.FirstOrDefault(t => t.MaTK == id);
            if (taiKhoan == null)
            {
                return NotFound();
            }

            _taiKhoans.Remove(taiKhoan);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting account");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

public class LoginRequest
{
    public string TenDangNhap { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
}