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

    public async Task<IEnumerable<Food>> GetAllAsync(string? search = null)
    {
        var query = _context.Foods.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(f => f.Name.Contains(search));
        }

        return await query
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