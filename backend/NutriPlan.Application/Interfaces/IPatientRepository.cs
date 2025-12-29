using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IPatientRepository
{
    Task<IEnumerable<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(Guid id);
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient> UpdateAsync(Patient patient);
    Task DeleteAsync(Guid id);
}