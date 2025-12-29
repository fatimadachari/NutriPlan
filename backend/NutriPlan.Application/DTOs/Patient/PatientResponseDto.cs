namespace NutriPlan.Application.DTOs.Patient;

public class PatientResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Age { get; set; }
    public decimal Weight { get; set; }
    public decimal Height { get; set; }
    public string Goal { get; set; } = string.Empty;
    public Guid NutritionistId { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<AllergyDto> Allergies { get; set; } = new();
    public List<HealthConditionDto> HealthConditions { get; set; } = new();
    public List<DietaryPreferenceDto> DietaryPreferences { get; set; } = new();
}

public class AllergyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class HealthConditionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class DietaryPreferenceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}