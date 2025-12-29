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
}