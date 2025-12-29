namespace NutriPlan.Application.DTOs.Food;

public class FoodResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
    public int ServingSize { get; set; }

    // Alérgenos
    public bool ContainsGluten { get; set; }
    public bool ContainsLactose { get; set; }
    public bool ContainsSoy { get; set; }
    public bool ContainsNuts { get; set; }
    public bool ContainsEggs { get; set; }
    public bool ContainsFish { get; set; }
    public bool ContainsShellfish { get; set; }

    // Controle de saúde
    public decimal SugarContent { get; set; }
    public decimal SodiumContent { get; set; }
}