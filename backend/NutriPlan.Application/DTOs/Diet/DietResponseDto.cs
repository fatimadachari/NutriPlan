using NutriPlan.Application.DTOs.Meal;

namespace NutriPlan.Application.DTOs.Diet;

public class DietResponseDto
{
    public Guid Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
    public Guid PatientId { get; set; }
    public List<MealResponseDto> Meals { get; set; } = new();
}