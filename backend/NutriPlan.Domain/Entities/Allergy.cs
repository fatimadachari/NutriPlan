namespace NutriPlan.Domain.Entities;

public class Allergy
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } // Ex: "Lactose", "Glúten", "Amendoim"
    public string Category { get; private set; } // Ex: "Alergia", "Intolerância"

    public Allergy(string name, string category)
    {
        Id = Guid.NewGuid();
        Name = name;
        Category = category;
    }

    private Allergy() { }
}