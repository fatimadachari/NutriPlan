using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class DietRepository : IDietRepository
{
    private readonly AppDbContext _context;

    public DietRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Diet>> GetAllByPatientIdAsync(Guid patientId)
    {
        return await _context.Diets
            .AsNoTracking()
            .Include(d => d.Meals.OrderBy(m => m.Order))
                .ThenInclude(m => m.MealFoods)
                    .ThenInclude(mf => mf.Food)
            .Where(d => d.PatientId == patientId)
            .OrderByDescending(d => d.CreatedDate)
            .ToListAsync();
    }

    public async Task<Diet?> GetByIdAsync(Guid id)
    {
        return await _context.Diets
            .Include(d => d.Meals.OrderBy(m => m.Order))
                .ThenInclude(m => m.MealFoods)
                    .ThenInclude(mf => mf.Food)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Diet> CreateAsync(Diet diet)
    {
        await _context.Diets.AddAsync(diet);
        await _context.SaveChangesAsync();
        return diet;
    }

    public async Task<Diet> UpdateAsync(Diet diet)
    {
        // Anexar apenas se não estiver sendo tracked
        var entry = _context.Entry(diet);
        if (entry.State == EntityState.Detached)
        {
            _context.Diets.Attach(diet);
            entry.State = EntityState.Modified;
        }

        await _context.SaveChangesAsync();
        return diet;
    }

    public async Task DeleteAsync(Guid id)
    {
        var diet = await _context.Diets.FindAsync(id);
        if (diet != null)
        {
            _context.Diets.Remove(diet);
            await _context.SaveChangesAsync();
        }
    }
}