using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.DTOs.Patient;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AllergiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AllergiesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AllergyDto>>> GetAll()
    {
        var allergies = await _context.Allergies
            .OrderBy(a => a.Name)
            .ToListAsync();

        var response = allergies.Select(a => new AllergyDto
        {
            Id = a.Id,
            Name = a.Name,
            Category = a.Category
        });

        return Ok(response);
    }
}