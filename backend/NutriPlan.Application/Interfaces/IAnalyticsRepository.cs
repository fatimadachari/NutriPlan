using NutriPlan.Application.DTOs.Analytics;

namespace NutriPlan.Application.Interfaces;

public interface IAnalyticsRepository
{
    Task<DashboardStatsDto> GetDashboardStatsAsync(Guid nutritionistId);
    Task<IEnumerable<PatientsByGoalDto>> GetPatientsByGoalAsync(Guid nutritionistId);
    Task<IEnumerable<PatientProgressDto>> GetTopProgressPatientsAsync(Guid nutritionistId, int limit = 10);
    Task<IEnumerable<InactivePatientDto>> GetInactivePatientsAsync(Guid nutritionistId, int daysThreshold = 30);
    Task<IEnumerable<BMIDistributionDto>> GetBMIDistributionAsync(Guid nutritionistId);
}