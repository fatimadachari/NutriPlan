using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class MealFoodRepository : IMealFoodRepository
{
    private readonly AppDbContext _context;

    public MealFoodRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<MealFood?> GetByIdAsync(Guid id)
    {
        return await _context.MealFoods
            .Include(mf => mf.Meal)
            .Include(mf => mf.Food)
            .FirstOrDefaultAsync(mf => mf.Id == id);
    }

    public async Task<MealFood> CreateAsync(MealFood mealFood)
    {
        await _context.MealFoods.AddAsync(mealFood);
        await _context.SaveChangesAsync();
        return mealFood;
    }

    public async Task DeleteAsync(Guid id)
    {
        var mealFood = await _context.MealFoods.FindAsync(id);
        if (mealFood != null)
        {
            _context.MealFoods.Remove(mealFood);
            await _context.SaveChangesAsync();
        }
    }
}