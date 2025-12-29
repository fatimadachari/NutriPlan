using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.MealFood;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MealFoodsController : ControllerBase
{
    private readonly IMealFoodRepository _mealFoodRepository;
    private readonly IMealRepository _mealRepository;
    private readonly IFoodRepository _foodRepository;
    private readonly IDietRepository _dietRepository;

    public MealFoodsController(
        IMealFoodRepository mealFoodRepository,
        IMealRepository mealRepository,
        IFoodRepository foodRepository,
        IDietRepository dietRepository)
    {
        _mealFoodRepository = mealFoodRepository;
        _mealRepository = mealRepository;
        _foodRepository = foodRepository;
        _dietRepository = dietRepository;
    }

    [HttpPost]
    public async Task<ActionResult<MealFoodResponseDto>> AddFood([FromBody] AddFoodToMealDto dto)
    {
        // Buscar meal (sem tracking para evitar conflitos)
        var meal = await _mealRepository.GetByIdAsync(dto.MealId);
        if (meal == null)
            return NotFound(new { message = "Refeição não encontrada" });

        var food = await _foodRepository.GetByIdAsync(dto.FoodId);
        if (food == null)
            return NotFound(new { message = "Alimento não encontrado" });

        // Criar o MealFood
        var mealFood = new MealFood(dto.MealId, dto.FoodId, dto.Quantity, food);
        var created = await _mealFoodRepository.CreateAsync(mealFood);

        // Buscar meal novamente para recalcular (essa busca traz os dados atualizados)
        var mealToUpdate = await _mealRepository.GetByIdAsync(dto.MealId);
        if (mealToUpdate != null)
        {
            mealToUpdate.RecalculateTotals();
            await _mealRepository.UpdateAsync(mealToUpdate);

            // Buscar diet novamente para recalcular
            var dietToUpdate = await _dietRepository.GetByIdAsync(mealToUpdate.DietId);
            if (dietToUpdate != null)
            {
                dietToUpdate.RecalculateTotals();
                await _dietRepository.UpdateAsync(dietToUpdate);
            }
        }

        var response = new MealFoodResponseDto
        {
            Id = created.Id,
            Quantity = created.Quantity,
            CalculatedCalories = created.CalculatedCalories,
            CalculatedProtein = created.CalculatedProtein,
            CalculatedCarbs = created.CalculatedCarbs,
            CalculatedFat = created.CalculatedFat,
            MealId = created.MealId,
            FoodId = created.FoodId,
            FoodName = food.Name
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var mealFood = await _mealFoodRepository.GetByIdAsync(id);
        if (mealFood == null)
            return NotFound(new { message = "Alimento da refeição não encontrado" });

        var mealId = mealFood.MealId;

        await _mealFoodRepository.DeleteAsync(id);

        // Recalcular totais da refeição
        var meal = await _mealRepository.GetByIdAsync(mealId);
        if (meal != null)
        {
            meal.RecalculateTotals();
            await _mealRepository.UpdateAsync(meal);

            // Recalcular totais da dieta
            var diet = await _dietRepository.GetByIdAsync(meal.DietId);
            if (diet != null)
            {
                diet.RecalculateTotals();
                await _dietRepository.UpdateAsync(diet);
            }
        }

        return NoContent();
    }
}