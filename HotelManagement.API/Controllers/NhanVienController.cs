using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NhanVienController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<NhanVienController> _logger;

    public NhanVienController(HotelDbContext context, ILogger<NhanVienController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/NhanVien
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NhanVien>>> GetNhanViens()
    {
        try
        {
            _logger.LogInformation("Fetching all employees");
            var nhanViens = await _context.NhanViens.ToListAsync();
            _logger.LogInformation($"Successfully fetched {nhanViens.Count} employees");
            return nhanViens;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching employees");
            throw;
        }
    }

    // GET: api/NhanVien/5
    [HttpGet("{id}")]
    public async Task<ActionResult<NhanVien>> GetNhanVien(string id)
    {
        try
        {
            _logger.LogInformation($"Fetching employee with ID: {id}");
            var nhanVien = await _context.NhanViens.FindAsync(id);
            if (nhanVien == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found");
                return NotFound();
            }
            _logger.LogInformation($"Successfully fetched employee with ID: {id}");
            return nhanVien;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while fetching employee with ID: {id}");
            throw;
        }
    }

    // POST: api/NhanVien
    [HttpPost]
    public async Task<ActionResult<NhanVien>> CreateNhanVien(NhanVien nhanVien)
    {
        try
        {
            _logger.LogInformation($"Creating new employee: {nhanVien.HoTen}");
            _context.NhanViens.Add(nhanVien);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully created employee with ID: {nhanVien.MaNV}");
            return CreatedAtAction(nameof(GetNhanVien), new { id = nhanVien.MaNV }, nhanVien);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating employee");
            throw;
        }
    }

    // PUT: api/NhanVien/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNhanVien(string id, NhanVien nhanVien)
    {
        try
        {
            if (id != nhanVien.MaNV)
            {
                _logger.LogWarning($"ID mismatch: {id} != {nhanVien.MaNV}");
                return BadRequest();
            }
            _context.Entry(nhanVien).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully updated employee with ID: {id}");
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!NhanVienExists(id))
            {
                _logger.LogWarning($"Employee with ID: {id} not found");
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while updating employee with ID: {id}");
            throw;
        }
    }

    // DELETE: api/NhanVien/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNhanVien(string id)
    {
        try
        {
            _logger.LogInformation($"Deleting employee with ID: {id}");
            var nhanVien = await _context.NhanViens.FindAsync(id);
            if (nhanVien == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found");
                return NotFound();
            }
            _context.NhanViens.Remove(nhanVien);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully deleted employee with ID: {id}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while deleting employee with ID: {id}");
            throw;
        }
    }

    private bool NhanVienExists(string id)
    {
        return _context.NhanViens.Any(e => e.MaNV == id);
    }
}