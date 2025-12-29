using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IMealFoodRepository
{
    Task<MealFood?> GetByIdAsync(Guid id);
    Task<MealFood> CreateAsync(MealFood mealFood);
    Task DeleteAsync(Guid id);
}