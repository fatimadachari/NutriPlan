namespace NutriPlan.Domain.Entities;

public class PatientDietaryPreference
{
    public Guid PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public Guid DietaryPreferenceId { get; set; }
    public DietaryPreference DietaryPreference { get; set; } = null!;

    public DateTime AddedAt { get; set; }
}