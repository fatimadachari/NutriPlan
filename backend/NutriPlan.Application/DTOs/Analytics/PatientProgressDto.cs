namespace NutriPlan.Application.DTOs.Analytics;

public class PatientProgressDto
{
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public decimal InitialWeight { get; set; }
    public decimal CurrentWeight { get; set; }
    public decimal WeightChange { get; set; }
    public int DaysSinceStart { get; set; }
    public decimal WeeklyAverage { get; set; }
    public DateTime FirstMeasurementDate { get; set; }
    public DateTime LastMeasurementDate { get; set; }
}