using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data;

public class DataSeeder
{
    private readonly AppDbContext _context;

    public DataSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Seed Nutritionist
        if (!_context.Nutritionists.Any())
        {
            var nutritionist = new Nutritionist(
                "Dr. Ana Paula Santos",
                "ana.santos@nutriplan.com",
                "CRN-12345"
            );

            await _context.Nutritionists.AddAsync(nutritionist);
            await _context.SaveChangesAsync();
        }

        // Seed Foods
        if (!_context.Foods.Any())
        {
            var foods = GetTacoFoods();
            await _context.Foods.AddRangeAsync(foods);
            await _context.SaveChangesAsync();
        }
    }

    private List<Food> GetTacoFoods()
    {
        return new List<Food>
        {
            // Cereais e derivados
            new Food("Arroz branco cozido", 128m, 2.5m, 28.1m, 0.2m),
            new Food("Arroz integral cozido", 123m, 2.6m, 25.8m, 1.0m),
            new Food("Macarrão cozido", 135m, 5.0m, 28.0m, 0.5m),
            new Food("Pão francês", 300m, 8.0m, 58.6m, 3.1m),
            new Food("Pão integral", 253m, 9.4m, 49.0m, 3.5m),
            new Food("Aveia em flocos", 394m, 13.9m, 66.6m, 8.5m),
            new Food("Tapioca", 352m, 0.6m, 88.7m, 0.0m),
            
            // Leguminosas
            new Food("Feijão preto cozido", 77m, 4.5m, 14.0m, 0.5m),
            new Food("Feijão carioca cozido", 76m, 4.8m, 13.6m, 0.5m),
            new Food("Lentilha cozida", 93m, 6.3m, 16.3m, 0.4m),
            new Food("Grão de bico cozido", 121m, 6.8m, 18.9m, 2.1m),
            new Food("Ervilha cozida", 63m, 5.4m, 10.7m, 0.3m),
            
            // Carnes e ovos
            new Food("Frango grelhado (peito)", 159m, 32.0m, 0.0m, 3.6m),
            new Food("Carne bovina magra grelhada", 219m, 32.7m, 0.0m, 9.3m),
            new Food("Peixe grelhado (tilápia)", 96m, 20.1m, 0.0m, 1.7m),
            new Food("Ovo cozido", 155m, 13.3m, 1.1m, 10.6m),
            new Food("Atum em conserva", 118m, 26.0m, 0.0m, 0.8m),
            new Food("Salmão grelhado", 211m, 25.4m, 0.0m, 11.9m),
            
            // Leite e derivados
            new Food("Leite integral", 61m, 3.2m, 4.6m, 3.2m),
            new Food("Leite desnatado", 35m, 3.4m, 4.9m, 0.1m),
            new Food("Iogurte natural integral", 51m, 4.1m, 4.7m, 1.5m),
            new Food("Queijo mussarela", 280m, 25.0m, 3.6m, 19.5m),
            new Food("Queijo cottage", 98m, 13.7m, 3.4m, 4.3m),
            new Food("Requeijão cremoso", 264m, 10.0m, 6.0m, 22.0m),
            
            // Vegetais
            new Food("Alface", 15m, 1.3m, 2.9m, 0.2m),
            new Food("Tomate", 15m, 1.1m, 3.1m, 0.2m),
            new Food("Cenoura crua", 34m, 1.3m, 7.7m, 0.2m),
            new Food("Brócolis cozido", 25m, 2.4m, 4.0m, 0.4m),
            new Food("Batata inglesa cozida", 52m, 1.2m, 11.9m, 0.1m),
            new Food("Batata doce cozida", 77m, 0.6m, 18.4m, 0.1m),
            new Food("Abobrinha", 19m, 1.2m, 4.2m, 0.2m),
            new Food("Berinjela", 20m, 1.0m, 4.7m, 0.2m),
            new Food("Couve manteiga", 28m, 3.0m, 5.1m, 0.5m),
            new Food("Espinafre", 25m, 2.9m, 3.6m, 0.3m),
            
            // Frutas
            new Food("Banana nanica", 92m, 1.3m, 23.8m, 0.1m),
            new Food("Maçã", 56m, 0.3m, 15.2m, 0.3m),
            new Food("Laranja", 45m, 1.0m, 11.5m, 0.1m),
            new Food("Mamão papaya", 45m, 0.8m, 11.6m, 0.1m),
            new Food("Melancia", 33m, 0.9m, 8.1m, 0.1m),
            new Food("Abacate", 96m, 1.2m, 6.4m, 8.4m),
            new Food("Morango", 30m, 0.9m, 7.7m, 0.3m),
            new Food("Uva", 50m, 0.6m, 13.5m, 0.4m),
            new Food("Manga", 51m, 0.5m, 13.5m, 0.3m),
            new Food("Abacaxi", 48m, 0.9m, 12.3m, 0.1m),
            
            // Oleaginosas
            new Food("Amendoim", 544m, 27.2m, 20.3m, 43.9m),
            new Food("Castanha de caju", 570m, 18.5m, 29.1m, 46.3m),
            new Food("Amêndoas", 640m, 21.2m, 19.7m, 56.0m),
            new Food("Nozes", 654m, 15.2m, 13.7m, 65.2m),
            
            // Óleos e gorduras
            new Food("Azeite de oliva", 884m, 0.0m, 0.0m, 100.0m),
            new Food("Óleo de soja", 884m, 0.0m, 0.0m, 100.0m),
            new Food("Manteiga", 717m, 0.6m, 0.1m, 81.1m),
            
            // Outros
            new Food("Mel", 309m, 0.3m, 84.0m, 0.0m),
            new Food("Açúcar refinado", 387m, 0.0m, 99.8m, 0.0m)
        };
    }
}