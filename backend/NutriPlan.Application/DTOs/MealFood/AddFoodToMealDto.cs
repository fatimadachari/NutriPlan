namespace NutriPlan.Application.DTOs.MealFood;

public class AddFoodToMealDto
{
    public Guid MealId { get; set; }
    public Guid FoodId { get; set; }
    public int Quantity { get; set; }
}