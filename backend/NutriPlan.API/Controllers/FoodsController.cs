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
    public async Task<ActionResult<IEnumerable<FoodResponseDto>>> GetAll([FromQuery] string? search)
    {
        var foods = string.IsNullOrWhiteSpace(search)
            ? await _foodRepository.GetAllAsync()
            : await _foodRepository.SearchByNameAsync(search);

        var response = foods.Select(f => new FoodResponseDto
        {
            Id = f.Id,
            Name = f.Name,
            Calories = f.Calories,
            Protein = f.Protein,
            Carbs = f.Carbs,
            Fat = f.Fat,
            ServingSize = f.ServingSize
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FoodResponseDto>> GetById(Guid id)
    {
        var food = await _foodRepository.GetByIdAsync(id);
        if (food == null)
            return NotFound(new { message = "Alimento não encontrado" });

        var response = new FoodResponseDto
        {
            Id = food.Id,
            Name = food.Name,
            Calories = food.Calories,
            Protein = food.Protein,
            Carbs = food.Carbs,
            Fat = food.Fat,
            ServingSize = food.ServingSize
        };

        return Ok(response);
    }
}