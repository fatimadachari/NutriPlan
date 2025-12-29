namespace NutriPlan.Application.DTOs.BodyMeasurement;

public class BodyMeasurementResponseDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public DateTime MeasurementDate { get; set; }
    public decimal? Neck { get; set; }
    public decimal? Chest { get; set; }
    public decimal? Waist { get; set; }
    public decimal? Abdomen { get; set; }
    public decimal? Hip { get; set; }
    public decimal? RightArm { get; set; }
    public decimal? LeftArm { get; set; }
    public decimal? RightThigh { get; set; }
    public decimal? LeftThigh { get; set; }
    public decimal? RightCalf { get; set; }
    public decimal? LeftCalf { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? MuscleMassPercentage { get; set; }
    public string? Notes { get; set; }
}