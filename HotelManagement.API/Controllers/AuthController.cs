using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User loginRequest)
    {
        try
        {
            // For development, hardcoded admin credentials
            if (loginRequest.Username == "admin" && loginRequest.Password == "admin123")
            {
                return Ok(new
                {
                    token = "dummy-token",
                    user = new
                    {
                        MaTK = "1",
                        TenDangNhap = "admin",
                        quyenTruyCap = "admin",
                        MaNV = "1",
                        MaVaitro = "admin"
                    },
                    permissions = new
                    {
                        canManageUsers = true,
                        canManageRooms = true,
                        canManageBookings = true,
                        canManageBills = true,
                        canViewReports = true
                    }
                });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}