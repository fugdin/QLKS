using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly ILogger<CustomerController> _logger;
    private static List<KhachHang> _customers = new List<KhachHang>();
    private static int _nextId = 1;

    public CustomerController(ILogger<CustomerController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAllCustomers()
    {
        return Ok(_customers);
    }

    [HttpGet("{id}")]
    public IActionResult GetCustomerById(string id)
    {
        var customer = _customers.FirstOrDefault(c => c.MaKH == id);
        if (customer == null)
        {
            return NotFound();
        }
        return Ok(customer);
    }

    [HttpPost]
    public IActionResult CreateCustomer([FromBody] KhachHang customer)
    {
        try
        {
            customer.MaKH = $"KH{_nextId++}";
            _customers.Add(customer);
            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.MaKH }, customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateCustomer(string id, [FromBody] KhachHang customer)
    {
        try
        {
            var existingCustomer = _customers.FirstOrDefault(c => c.MaKH == id);
            if (existingCustomer == null)
            {
                return NotFound();
            }

            existingCustomer.HoTen = customer.HoTen;
            existingCustomer.CMND_CCCD = customer.CMND_CCCD;
            existingCustomer.DiaChi = customer.DiaChi;
            existingCustomer.SoDienThoai = customer.SoDienThoai;
            existingCustomer.Email = customer.Email;

            return Ok(existingCustomer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCustomer(string id)
    {
        try
        {
            var customer = _customers.FirstOrDefault(c => c.MaKH == id);
            if (customer == null)
            {
                return NotFound();
            }

            _customers.Remove(customer);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}