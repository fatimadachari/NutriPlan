using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces
{
    public interface IAnamneseRepository
    {
        Task<Anamnese?> GetByIdAsync(Guid id);
        Task<Anamnese?> GetByPatientIdAsync(Guid patientId);
        Task<IEnumerable<Anamnese>> GetAllAsync();
        Task<Anamnese> CreateAsync(Anamnese anamnese);
        Task<Anamnese> UpdateAsync(Anamnese anamnese);
        Task DeleteAsync(Guid id);
        Task<bool> PatientHasAnamneseAsync(Guid patientId);
    }
}