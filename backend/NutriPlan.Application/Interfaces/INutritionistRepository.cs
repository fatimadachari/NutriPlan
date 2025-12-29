using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface INutritionistRepository
{
    Task<IEnumerable<Nutritionist>> GetAllAsync();
    Task<Nutritionist?> GetByIdAsync(Guid id);
}