namespace NutriPlan.Application.DTOs.MealFood;

public class MealFoodResponseDto
{
    public Guid Id { get; set; }
    public int Quantity { get; set; }
    public decimal CalculatedCalories { get; set; }
    public decimal CalculatedProtein { get; set; }
    public decimal CalculatedCarbs { get; set; }
    public decimal CalculatedFat { get; set; }
    public Guid MealId { get; set; }
    public Guid FoodId { get; set; }
    public string FoodName { get; set; } = string.Empty;
}