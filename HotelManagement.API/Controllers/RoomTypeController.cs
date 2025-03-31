using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomTypeController : ControllerBase
{
    private readonly ILogger<RoomTypeController> _logger;
    private static List<LoaiPhong> _roomTypes = new List<LoaiPhong>();
    private static int _nextId = 1;

    public RoomTypeController(ILogger<RoomTypeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAllRoomTypes()
    {
        return Ok(_roomTypes);
    }

    [HttpGet("{id}")]
    public IActionResult GetRoomTypeById(string id)
    {
        var roomType = _roomTypes.FirstOrDefault(r => r.MaLoaiPhong == id);
        if (roomType == null)
        {
            return NotFound();
        }
        return Ok(roomType);
    }

    [HttpPost]
    public IActionResult CreateRoomType([FromBody] LoaiPhong roomType)
    {
        try
        {
            if (string.IsNullOrEmpty(roomType.TenLoai))
            {
                return BadRequest(new { message = "Tên loại phòng không được để trống" });
            }

            roomType.MaLoaiPhong = $"LP{_nextId++}";
            roomType.GiaCoBan = decimal.TryParse(roomType.GiaCoBan.ToString(), out decimal result) ? result : 0;
            _roomTypes.Add(roomType);
            return CreatedAtAction(nameof(GetRoomTypeById), new { id = roomType.MaLoaiPhong }, roomType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating room type");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateRoomType(string id, [FromBody] LoaiPhong roomType)
    {
        try
        {
            var existingRoomType = _roomTypes.FirstOrDefault(r => r.MaLoaiPhong == id);
            if (existingRoomType == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(roomType.TenLoai))
            {
                return BadRequest(new { message = "Tên loại phòng không được để trống" });
            }

            existingRoomType.TenLoai = roomType.TenLoai;
            existingRoomType.MoTa = roomType.MoTa;
            existingRoomType.GiaCoBan = decimal.TryParse(roomType.GiaCoBan.ToString(), out decimal result) ? result : 0;

            return Ok(existingRoomType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating room type");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteRoomType(string id)
    {
        try
        {
            var roomType = _roomTypes.FirstOrDefault(r => r.MaLoaiPhong == id);
            if (roomType == null)
            {
                return NotFound();
            }

            _roomTypes.Remove(roomType);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting room type");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}