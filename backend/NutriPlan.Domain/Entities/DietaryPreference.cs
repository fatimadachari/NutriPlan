namespace NutriPlan.Domain.Entities;

public class DietaryPreference
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } // Ex: "Vegetariano", "Vegano", "Low-carb"

    public DietaryPreference(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
    }

    private DietaryPreference() { }
}