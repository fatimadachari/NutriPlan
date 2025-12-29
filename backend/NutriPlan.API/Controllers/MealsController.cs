using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Meal;
using NutriPlan.Application.DTOs.MealFood;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MealsController : ControllerBase
{
    private readonly IMealRepository _mealRepository;
    private readonly IDietRepository _dietRepository;

    public MealsController(IMealRepository mealRepository, IDietRepository dietRepository)
    {
        _mealRepository = mealRepository;
        _dietRepository = dietRepository;
    }

    [HttpPost]
    public async Task<ActionResult<MealResponseDto>> Create([FromBody] CreateMealDto dto)
    {
        var diet = await _dietRepository.GetByIdAsync(dto.DietId);
        if (diet == null)
            return NotFound(new { message = "Dieta não encontrada" });

        var meal = new Meal(dto.Name, dto.Order, dto.DietId);
        var created = await _mealRepository.CreateAsync(meal);

        var response = new MealResponseDto
        {
            Id = created.Id,
            Name = created.Name,
            Order = created.Order,
            TotalCalories = created.TotalCalories,
            TotalProtein = created.TotalProtein,
            TotalCarbs = created.TotalCarbs,
            TotalFat = created.TotalFat,
            DietId = created.DietId
        };

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MealResponseDto>> GetById(Guid id)
    {
        var meal = await _mealRepository.GetByIdAsync(id);
        if (meal == null)
            return NotFound(new { message = "Refeição não encontrada" });

        var response = new MealResponseDto
        {
            Id = meal.Id,
            Name = meal.Name,
            Order = meal.Order,
            TotalCalories = meal.TotalCalories,
            TotalProtein = meal.TotalProtein,
            TotalCarbs = meal.TotalCarbs,
            TotalFat = meal.TotalFat,
            DietId = meal.DietId,
            MealFoods = meal.MealFoods.Select(mf => new MealFoodResponseDto
            {
                Id = mf.Id,
                Quantity = mf.Quantity,
                CalculatedCalories = mf.CalculatedCalories,
                CalculatedProtein = mf.CalculatedProtein,
                CalculatedCarbs = mf.CalculatedCarbs,
                CalculatedFat = mf.CalculatedFat,
                MealId = mf.MealId,
                FoodId = mf.FoodId,
                FoodName = mf.Food?.Name ?? string.Empty
            }).ToList()
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var meal = await _mealRepository.GetByIdAsync(id);
        if (meal == null)
            return NotFound(new { message = "Refeição não encontrada" });

        await _mealRepository.DeleteAsync(id);
        return NoContent();
    }
}