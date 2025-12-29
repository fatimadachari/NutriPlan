namespace NutriPlan.Application.DTOs.Patient;

public class UpdatePatientRestrictionsDto
{
    public List<Guid> AllergyIds { get; set; } = new();
    public List<Guid> HealthConditionIds { get; set; } = new();
    public List<Guid> DietaryPreferenceIds { get; set; } = new();
}