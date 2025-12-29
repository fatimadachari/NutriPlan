using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class FoodRepository : IFoodRepository
{
    private readonly AppDbContext _context;

    public FoodRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Food>> GetAllAsync()
    {
        return await _context.Foods
            .AsNoTracking()
            .OrderBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Food>> SearchByNameAsync(string name)
    {
        return await _context.Foods
            .AsNoTracking()
            .Where(f => f.Name.Contains(name))
            .OrderBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<Food?> GetByIdAsync(Guid id)
    {
        return await _context.Foods
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);
    }
}