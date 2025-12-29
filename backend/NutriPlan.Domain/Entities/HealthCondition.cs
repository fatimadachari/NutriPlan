namespace NutriPlan.Domain.Entities;

public class HealthCondition
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } // Ex: "Diabetes", "Hipertensão"
    public string Description { get; private set; }

    public HealthCondition(string name, string description)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
    }

    private HealthCondition() { }
}