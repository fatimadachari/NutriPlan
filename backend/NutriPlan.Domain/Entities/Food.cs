namespace NutriPlan.Domain.Entities;

public class Food
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal Calories { get; private set; }
    public decimal Protein { get; private set; }
    public decimal Carbs { get; private set; }
    public decimal Fat { get; private set; }
    public int ServingSize { get; private set; }

    // Novos campos para alérgenos
    public bool ContainsGluten { get; private set; }
    public bool ContainsLactose { get; private set; }
    public bool ContainsSoy { get; private set; }
    public bool ContainsNuts { get; private set; }
    public bool ContainsEggs { get; private set; }
    public bool ContainsFish { get; private set; }
    public bool ContainsShellfish { get; private set; }

    // Para controle de diabetes/hipertensão
    public decimal SugarContent { get; private set; }
    public decimal SodiumContent { get; private set; }

    public Food(
        string name,
        decimal calories,
        decimal protein,
        decimal carbs,
        decimal fat,
        int servingSize = 100,
        bool containsGluten = false,
        bool containsLactose = false,
        bool containsSoy = false,
        bool containsNuts = false,
        bool containsEggs = false,
        bool containsFish = false,
        bool containsShellfish = false,
        decimal sugarContent = 0,
        decimal sodiumContent = 0)
    {
        Id = Guid.NewGuid();
        Name = name;
        Calories = calories;
        Protein = protein;
        Carbs = carbs;
        Fat = fat;
        ServingSize = servingSize;
        ContainsGluten = containsGluten;
        ContainsLactose = containsLactose;
        ContainsSoy = containsSoy;
        ContainsNuts = containsNuts;
        ContainsEggs = containsEggs;
        ContainsFish = containsFish;
        ContainsShellfish = containsShellfish;
        SugarContent = sugarContent;
        SodiumContent = sodiumContent;
    }

    private Food() { }
}