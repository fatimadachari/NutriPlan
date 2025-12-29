using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.DTOs.Patient;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HealthConditionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthConditionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthConditionDto>>> GetAll()
    {
        var conditions = await _context.HealthConditions
            .OrderBy(h => h.Name)
            .ToListAsync();

        var response = conditions.Select(h => new HealthConditionDto
        {
            Id = h.Id,
            Name = h.Name,
            Description = h.Description
        });

        return Ok(response);
    }
}