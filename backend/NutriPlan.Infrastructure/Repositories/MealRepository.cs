using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class MealRepository : IMealRepository
{
    private readonly AppDbContext _context;

    public MealRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Meal?> GetByIdAsync(Guid id)
    {
        return await _context.Meals
            .Include(m => m.MealFoods)
                .ThenInclude(mf => mf.Food)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Meal> CreateAsync(Meal meal)
    {
        await _context.Meals.AddAsync(meal);
        await _context.SaveChangesAsync();
        return meal;
    }

    public async Task<Meal> UpdateAsync(Meal meal)
    {
        // Anexar apenas se não estiver sendo tracked
        var entry = _context.Entry(meal);
        if (entry.State == EntityState.Detached)
        {
            _context.Meals.Attach(meal);
            entry.State = EntityState.Modified;
        }

        await _context.SaveChangesAsync();
        return meal;
    }

    public async Task DeleteAsync(Guid id)
    {
        var meal = await _context.Meals.FindAsync(id);
        if (meal != null)
        {
            _context.Meals.Remove(meal);
            await _context.SaveChangesAsync();
        }
    }
}