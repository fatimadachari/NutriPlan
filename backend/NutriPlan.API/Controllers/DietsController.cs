using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Diet;
using NutriPlan.Application.DTOs.Meal;
using NutriPlan.Application.DTOs.MealFood;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DietsController : ControllerBase
{
    private readonly IDietRepository _dietRepository;
    private readonly IPatientRepository _patientRepository;

    public DietsController(IDietRepository dietRepository, IPatientRepository patientRepository)
    {
        _dietRepository = dietRepository;
        _patientRepository = patientRepository;
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<DietResponseDto>>> GetByPatient(Guid patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var diets = await _dietRepository.GetAllByPatientIdAsync(patientId);
        var response = diets.Select(d => MapToDietResponse(d));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DietResponseDto>> GetById(Guid id)
    {
        var diet = await _dietRepository.GetByIdAsync(id);
        if (diet == null)
            return NotFound(new { message = "Dieta não encontrada" });

        var response = MapToDietResponse(diet);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<DietResponseDto>> Create([FromBody] CreateDietDto dto)
    {
        var patient = await _patientRepository.GetByIdAsync(dto.PatientId);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var diet = new Diet(dto.PatientId);
        var created = await _dietRepository.CreateAsync(diet);

        var response = MapToDietResponse(created);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var diet = await _dietRepository.GetByIdAsync(id);
        if (diet == null)
            return NotFound(new { message = "Dieta não encontrada" });

        await _dietRepository.DeleteAsync(id);
        return NoContent();
    }

    private DietResponseDto MapToDietResponse(Diet diet)
    {
        return new DietResponseDto
        {
            Id = diet.Id,
            CreatedDate = diet.CreatedDate,
            TotalCalories = diet.TotalCalories,
            TotalProtein = diet.TotalProtein,
            TotalCarbs = diet.TotalCarbs,
            TotalFat = diet.TotalFat,
            PatientId = diet.PatientId,
            Meals = diet.Meals.Select(m => new MealResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                Order = m.Order,
                TotalCalories = m.TotalCalories,
                TotalProtein = m.TotalProtein,
                TotalCarbs = m.TotalCarbs,
                TotalFat = m.TotalFat,
                DietId = m.DietId,
                MealFoods = m.MealFoods.Select(mf => new MealFoodResponseDto
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
            }).ToList()
        };
    }
}