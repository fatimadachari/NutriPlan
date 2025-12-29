using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class NutritionistRepository : INutritionistRepository
{
    private readonly AppDbContext _context;

    public NutritionistRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Nutritionist>> GetAllAsync()
    {
        return await _context.Nutritionists
            .AsNoTracking()
            .OrderBy(n => n.Name)
            .ToListAsync();
    }

    public async Task<Nutritionist?> GetByIdAsync(Guid id)
    {
        return await _context.Nutritionists
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == id);
    }
}