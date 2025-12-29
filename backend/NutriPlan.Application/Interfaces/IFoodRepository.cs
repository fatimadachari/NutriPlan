using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IFoodRepository
{
    Task<IEnumerable<Food>> GetAllAsync();
    Task<IEnumerable<Food>> SearchByNameAsync(string name);
    Task<Food?> GetByIdAsync(Guid id);
}