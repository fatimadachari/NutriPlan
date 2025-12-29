namespace NutriPlan.Domain.Entities;

public class MealFood
{
    public Guid Id { get; private set; }
    public int Quantity { get; private set; } // Quantidade em gramas

    public decimal CalculatedCalories { get; private set; }
    public decimal CalculatedProtein { get; private set; }
    public decimal CalculatedCarbs { get; private set; }
    public decimal CalculatedFat { get; private set; }

    public Guid MealId { get; private set; }
    public Meal Meal { get; private set; }

    public Guid FoodId { get; private set; }
    public Food Food { get; private set; }

    public MealFood(Guid mealId, Guid foodId, int quantity, Food food)
    {
        Id = Guid.NewGuid();
        MealId = mealId;
        FoodId = foodId;
        Quantity = quantity;

        CalculateNutrients(food);
    }

    private void CalculateNutrients(Food food)
    {
        var factor = (decimal)Quantity / 100; // Proporção baseada em 100g

        CalculatedCalories = food.Calories * factor;
        CalculatedProtein = food.Protein * factor;
        CalculatedCarbs = food.Carbs * factor;
        CalculatedFat = food.Fat * factor;
    }

    private MealFood() { }
}