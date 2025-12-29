using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Interfaces;

public interface IBodyMeasurementRepository
{
    Task<IEnumerable<BodyMeasurement>> GetByPatientIdAsync(Guid patientId);
    Task<BodyMeasurement?> GetByIdAsync(Guid id);
    Task<BodyMeasurement> CreateAsync(BodyMeasurement bodyMeasurement);
    Task DeleteAsync(Guid id);
}