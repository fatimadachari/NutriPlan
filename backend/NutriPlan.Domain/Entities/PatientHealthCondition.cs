namespace NutriPlan.Domain.Entities;

public class PatientHealthCondition
{
    public Guid PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public Guid HealthConditionId { get; set; }
    public HealthCondition HealthCondition { get; set; } = null!;

    public DateTime DiagnosedAt { get; set; }
    public string? Notes { get; set; }
}