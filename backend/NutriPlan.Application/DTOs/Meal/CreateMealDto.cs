namespace NutriPlan.Application.DTOs.Meal;

public class CreateMealDto
{
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public Guid DietId { get; set; }
}