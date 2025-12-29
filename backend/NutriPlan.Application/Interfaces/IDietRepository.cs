using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IDietRepository
{
    Task<IEnumerable<Diet>> GetAllByPatientIdAsync(Guid patientId);
    Task<Diet?> GetByIdAsync(Guid id);
    Task<Diet> CreateAsync(Diet diet);
    Task<Diet> UpdateAsync(Diet diet);
    Task DeleteAsync(Guid id);
}