using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IMealRepository
{
    Task<Meal?> GetByIdAsync(Guid id);
    Task<Meal> CreateAsync(Meal meal);
    Task<Meal> UpdateAsync(Meal meal);
    Task DeleteAsync(Guid id);
}