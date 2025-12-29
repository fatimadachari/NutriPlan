using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Nutritionist;
using NutriPlan.Application.Interfaces;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NutritionistsController : ControllerBase
{
    private readonly INutritionistRepository _nutritionistRepository;

    public NutritionistsController(INutritionistRepository nutritionistRepository)
    {
        _nutritionistRepository = nutritionistRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NutritionistResponseDto>>> GetAll()
    {
        var nutritionists = await _nutritionistRepository.GetAllAsync();
        var response = nutritionists.Select(n => new NutritionistResponseDto
        {
            Id = n.Id,
            Name = n.Name,
            Email = n.Email,
            CRN = n.CRN,
            CreatedAt = n.CreatedAt
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NutritionistResponseDto>> GetById(Guid id)
    {
        var nutritionist = await _nutritionistRepository.GetByIdAsync(id);
        if (nutritionist == null)
            return NotFound(new { message = "Nutricionista não encontrado" });

        var response = new NutritionistResponseDto
        {
            Id = nutritionist.Id,
            Name = nutritionist.Name,
            Email = nutritionist.Email,
            CRN = nutritionist.CRN,
            CreatedAt = nutritionist.CreatedAt
        };

        return Ok(response);
    }
}