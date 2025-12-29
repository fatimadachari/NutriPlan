namespace NutriPlan.Domain.Entities;

public class Food
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal Calories { get; private set; } // Kcal por 100g
    public decimal Protein { get; private set; } // Gramas por 100g
    public decimal Carbs { get; private set; } // Gramas por 100g
    public decimal Fat { get; private set; } // Gramas por 100g
    public int ServingSize { get; private set; } // Tamanho padrão da porção (100g)

    public Food(string name, decimal calories, decimal protein, decimal carbs, decimal fat, int servingSize = 100)
    {
        Id = Guid.NewGuid();
        Name = name;
        Calories = calories;
        Protein = protein;
        Carbs = carbs;
        Fat = fat;
        ServingSize = servingSize;
    }

    private Food() { }
}