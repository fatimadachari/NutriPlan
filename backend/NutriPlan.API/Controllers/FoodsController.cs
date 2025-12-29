using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Food;
using NutriPlan.Application.Interfaces;

namespace NutriPlan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodsController : ControllerBase
{
    private readonly IFoodRepository _foodRepository;

    public FoodsController(IFoodRepository foodRepository)
    {
        _foodRepository = foodRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodResponseDto>>> GetAll([FromQuery] string? search = null)
    {
        var foods = await _foodRepository.GetAllAsync(search);

        var response = foods.Select(f => new FoodResponseDto
        {
            Id = f.Id,
            Name = f.Name,
            Calories = f.Calories,
            Protein = f.Protein,
            Carbs = f.Carbs,
            Fat = f.Fat,
            ServingSize = f.ServingSize,
            ContainsGluten = f.ContainsGluten,
            ContainsLactose = f.ContainsLactose,
            ContainsSoy = f.ContainsSoy,
            ContainsNuts = f.ContainsNuts,
            ContainsEggs = f.ContainsEggs,
            ContainsFish = f.ContainsFish,
            ContainsShellfish = f.ContainsShellfish,
            SugarContent = f.SugarContent,
            SodiumContent = f.SodiumContent
        });

        return Ok(response);
    }
}