namespace NutriPlan.Domain.Entities;

public class Meal
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } 
    public int Order { get; private set; } 
    public decimal TotalCalories { get; private set; }
    public decimal TotalProtein { get; private set; }
    public decimal TotalCarbs { get; private set; }
    public decimal TotalFat { get; private set; }

    public Guid DietId { get; private set; }
    public Diet Diet { get; private set; }

    public ICollection<MealFood> MealFoods { get; private set; }

    public Meal(string name, int order, Guid dietId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Order = order;
        DietId = dietId;
        MealFoods = new List<MealFood>();
    }

    public void RecalculateTotals()
    {
        TotalCalories = MealFoods.Sum(mf => mf.CalculatedCalories);
        TotalProtein = MealFoods.Sum(mf => mf.CalculatedProtein);
        TotalCarbs = MealFoods.Sum(mf => mf.CalculatedCarbs);
        TotalFat = MealFoods.Sum(mf => mf.CalculatedFat);
    }

    private Meal() { }
}