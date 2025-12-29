namespace NutriPlan.Domain.Entities;

public class PatientAllergy
{
    public Guid PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public Guid AllergyId { get; set; }
    public Allergy Allergy { get; set; } = null!;

    public DateTime AddedAt { get; set; }
}