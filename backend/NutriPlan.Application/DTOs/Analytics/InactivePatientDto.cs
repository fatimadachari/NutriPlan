namespace NutriPlan.Application.DTOs.Analytics;

public class InactivePatientDto
{
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime? LastWeightMeasurement { get; set; }
    public DateTime? LastBodyMeasurement { get; set; }
    public int DaysSinceLastMeasurement { get; set; }
}