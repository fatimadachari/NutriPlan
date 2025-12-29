namespace NutriPlan.Application.DTOs.Nutritionist;

public class NutritionistResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CRN { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}