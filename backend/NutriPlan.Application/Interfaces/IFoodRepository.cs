using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IFoodRepository
{
    Task<IEnumerable<Food>> GetAllAsync(string? search = null);
    Task<Food?> GetByIdAsync(Guid id);
}