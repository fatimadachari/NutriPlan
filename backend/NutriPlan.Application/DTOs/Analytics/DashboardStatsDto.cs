namespace NutriPlan.Application.DTOs.Analytics;

public class DashboardStatsDto
{
    public int TotalPatients { get; set; }
    public int TotalDiets { get; set; }
    public int TotalWeightMeasurements { get; set; }
    public int TotalBodyMeasurements { get; set; }
    public int PatientsWithGoals { get; set; }
    public int ActivePatientsThisMonth { get; set; }
}