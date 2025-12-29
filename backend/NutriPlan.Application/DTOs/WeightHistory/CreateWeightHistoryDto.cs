namespace NutriPlan.Application.DTOs.WeightHistory;

public class CreateWeightHistoryDto
{
    public Guid PatientId { get; set; }
    public decimal Weight { get; set; }
    public DateTime MeasurementDate { get; set; }
    public string? Notes { get; set; }
}