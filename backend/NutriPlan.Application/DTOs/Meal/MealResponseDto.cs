using NutriPlan.Application.DTOs.MealFood;

namespace NutriPlan.Application.DTOs.Meal;

public class MealResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
    public Guid DietId { get; set; }
    public List<MealFoodResponseDto> MealFoods { get; set; } = new();
}