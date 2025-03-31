using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;

namespace HotelManagement.API.Data;

public class HotelDbContext : DbContext
{
    public HotelDbContext(DbContextOptions<HotelDbContext> options)
        : base(options)
    {
    }

    public DbSet<NhanVien> NhanViens { get; set; }
    // Add other DbSet properties for other tables here
}