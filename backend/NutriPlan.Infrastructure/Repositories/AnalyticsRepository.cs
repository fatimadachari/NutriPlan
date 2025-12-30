using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.DTOs.Analytics;
using NutriPlan.Application.Interfaces;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly AppDbContext _context;

    public AnalyticsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(Guid nutritionistId)
    {
        var patientIds = await _context.Patients
            .Where(p => p.NutritionistId == nutritionistId)
            .Select(p => p.Id)
            .ToListAsync();

        var totalPatients = patientIds.Count;
        var totalDiets = await _context.Diets
            .CountAsync(d => patientIds.Contains(d.PatientId));

        var totalWeightMeasurements = await _context.WeightHistories
            .CountAsync(w => patientIds.Contains(w.PatientId));

        var totalBodyMeasurements = await _context.BodyMeasurements
            .CountAsync(b => patientIds.Contains(b.PatientId));

        var patientsWithGoals = await _context.Patients
            .CountAsync(p => p.NutritionistId == nutritionistId && p.TargetWeight.HasValue);

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var activePatientsThisMonth = await _context.WeightHistories
            .Where(w => patientIds.Contains(w.PatientId) && w.MeasurementDate >= thirtyDaysAgo)
            .Select(w => w.PatientId)
            .Distinct()
            .CountAsync();

        return new DashboardStatsDto
        {
            TotalPatients = totalPatients,
            TotalDiets = totalDiets,
            TotalWeightMeasurements = totalWeightMeasurements,
            TotalBodyMeasurements = totalBodyMeasurements,
            PatientsWithGoals = patientsWithGoals,
            ActivePatientsThisMonth = activePatientsThisMonth
        };
    }

    public async Task<IEnumerable<PatientsByGoalDto>> GetPatientsByGoalAsync(Guid nutritionistId)
    {
        var patientsByGoal = await _context.Patients
            .Where(p => p.NutritionistId == nutritionistId)
            .GroupBy(p => p.Goal)
            .Select(g => new PatientsByGoalDto
            {
                Goal = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return patientsByGoal;
    }

    public async Task<IEnumerable<PatientProgressDto>> GetTopProgressPatientsAsync(Guid nutritionistId, int limit = 10)
    {
        var patientIds = await _context.Patients
            .Where(p => p.NutritionistId == nutritionistId)
            .Select(p => p.Id)
            .ToListAsync();

        var patientsWithProgress = new List<PatientProgressDto>();

        foreach (var patientId in patientIds)
        {
            var measurements = await _context.WeightHistories
                .Where(w => w.PatientId == patientId)
                .OrderBy(w => w.MeasurementDate)
                .ToListAsync();

            if (measurements.Count >= 2)
            {
                var first = measurements.First();
                var last = measurements.Last();
                var weightChange = last.Weight - first.Weight;
                var days = (last.MeasurementDate - first.MeasurementDate).Days;
                var weeklyAverage = days > 0 ? (weightChange / days) * 7 : 0;

                var patient = await _context.Patients.FindAsync(patientId);
                if (patient != null)
                {
                    patientsWithProgress.Add(new PatientProgressDto
                    {
                        PatientId = patientId,
                        PatientName = patient.Name,
                        InitialWeight = first.Weight,
                        CurrentWeight = last.Weight,
                        WeightChange = weightChange,
                        DaysSinceStart = days,
                        WeeklyAverage = weeklyAverage,
                        FirstMeasurementDate = first.MeasurementDate,
                        LastMeasurementDate = last.MeasurementDate
                    });
                }
            }
        }

        return patientsWithProgress
            .OrderBy(p => Math.Abs(p.WeightChange))
            .Take(limit)
            .OrderByDescending(p => Math.Abs(p.WeightChange))
            .ToList();
    }

    public async Task<IEnumerable<InactivePatientDto>> GetInactivePatientsAsync(Guid nutritionistId, int daysThreshold = 30)
    {
        var patients = await _context.Patients
            .Where(p => p.NutritionistId == nutritionistId)
            .ToListAsync();

        var inactivePatients = new List<InactivePatientDto>();
        var thresholdDate = DateTime.UtcNow.AddDays(-daysThreshold);

        foreach (var patient in patients)
        {
            var lastWeightMeasurement = await _context.WeightHistories
                .Where(w => w.PatientId == patient.Id)
                .OrderByDescending(w => w.MeasurementDate)
                .Select(w => w.MeasurementDate)
                .FirstOrDefaultAsync();

            var lastBodyMeasurement = await _context.BodyMeasurements
                .Where(b => b.PatientId == patient.Id)
                .OrderByDescending(b => b.MeasurementDate)
                .Select(b => b.MeasurementDate)
                .FirstOrDefaultAsync();

            var lastMeasurement = new[] { lastWeightMeasurement, lastBodyMeasurement }
                .Where(d => d != default)
                .DefaultIfEmpty()
                .Max();

            if (lastMeasurement == default || lastMeasurement < thresholdDate)
            {
                var daysSince = lastMeasurement != default
                    ? (DateTime.UtcNow - lastMeasurement).Days
                    : (DateTime.UtcNow - patient.CreatedAt).Days;

                inactivePatients.Add(new InactivePatientDto
                {
                    PatientId = patient.Id,
                    PatientName = patient.Name,
                    LastWeightMeasurement = lastWeightMeasurement != default ? lastWeightMeasurement : null,
                    LastBodyMeasurement = lastBodyMeasurement != default ? lastBodyMeasurement : null,
                    DaysSinceLastMeasurement = daysSince
                });
            }
        }

        return inactivePatients.OrderByDescending(p => p.DaysSinceLastMeasurement).ToList();
    }

    public async Task<IEnumerable<BMIDistributionDto>> GetBMIDistributionAsync(Guid nutritionistId)
    {
        var patients = await _context.Patients
            .Where(p => p.NutritionistId == nutritionistId)
            .ToListAsync();

        var distribution = new Dictionary<string, int>
        {
            { "Abaixo do peso", 0 },
            { "Peso normal", 0 },
            { "Sobrepeso", 0 },
            { "Obesidade", 0 }
        };

        foreach (var patient in patients)
        {
            var latestWeight = await _context.WeightHistories
                .Where(w => w.PatientId == patient.Id)
                .OrderByDescending(w => w.MeasurementDate)
                .Select(w => w.BMI)
                .FirstOrDefaultAsync();

            if (latestWeight == 0)
            {
                // Calcular BMI com base no peso cadastrado
                var heightInMeters = patient.Height / 100;
                latestWeight = patient.Weight / (heightInMeters * heightInMeters);
            }

            if (latestWeight < 18.5m)
                distribution["Abaixo do peso"]++;
            else if (latestWeight < 25m)
                distribution["Peso normal"]++;
            else if (latestWeight < 30m)
                distribution["Sobrepeso"]++;
            else
                distribution["Obesidade"]++;
        }

        return distribution.Select(kvp => new BMIDistributionDto
        {
            Category = kvp.Key,
            Count = kvp.Value
        }).ToList();
    }
}