using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IWeightHistoryRepository
{
    Task<IEnumerable<WeightHistory>> GetByPatientIdAsync(Guid patientId);
    Task<WeightHistory?> GetByIdAsync(Guid id);
    Task<WeightHistory> CreateAsync(WeightHistory weightHistory);
    Task<WeightHistory> UpdateAsync(WeightHistory weightHistory);
    Task DeleteAsync(Guid id);
}