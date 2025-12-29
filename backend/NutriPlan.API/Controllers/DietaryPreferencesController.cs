using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.DTOs.Patient;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DietaryPreferencesController : ControllerBase
{
    private readonly AppDbContext _context;

    public DietaryPreferencesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DietaryPreferenceDto>>> GetAll()
    {
        var preferences = await _context.DietaryPreferences
            .OrderBy(d => d.Name)
            .ToListAsync();

        var response = preferences.Select(d => new DietaryPreferenceDto
        {
            Id = d.Id,
            Name = d.Name
        });

        return Ok(response);
    }
}