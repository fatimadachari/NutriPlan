namespace NutriPlan.Application.DTOs.WeightHistory;

public class WeightHistoryResponseDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public decimal Weight { get; set; }
    public decimal BMI { get; set; }
    public DateTime MeasurementDate { get; set; }
    public string? Notes { get; set; }
}