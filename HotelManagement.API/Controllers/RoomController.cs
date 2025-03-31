using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private readonly ILogger<RoomController> _logger;
    private static List<Phong> _rooms = new List<Phong>();
    private static int _nextId = 1;

    public RoomController(ILogger<RoomController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAllRooms()
    {
        return Ok(_rooms);
    }

    [HttpGet("{id}")]
    public IActionResult GetRoomById(string id)
    {
        var room = _rooms.FirstOrDefault(r => r.MaPhong == id);
        if (room == null)
        {
            return NotFound();
        }
        return Ok(room);
    }

    [HttpPost]
    public IActionResult CreateRoom([FromBody] Phong room)
    {
        try
        {
            room.MaPhong = $"P{_nextId++}";
            _rooms.Add(room);
            return CreatedAtAction(nameof(GetRoomById), new { id = room.MaPhong }, room);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating room");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateRoom(string id, [FromBody] Phong room)
    {
        try
        {
            var existingRoom = _rooms.FirstOrDefault(r => r.MaPhong == id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            existingRoom.TenPhong = room.TenPhong;
            existingRoom.MaLoaiPhong = room.MaLoaiPhong;
            existingRoom.TrangThai = room.TrangThai;
            existingRoom.GhiChu = room.GhiChu;

            return Ok(existingRoom);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating room");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteRoom(string id)
    {
        try
        {
            var room = _rooms.FirstOrDefault(r => r.MaPhong == id);
            if (room == null)
            {
                return NotFound();
            }

            _rooms.Remove(room);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting room");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}