using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Analytics;
using NutriPlan.Application.Interfaces;
using System.Security.Claims;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _analyticsRepository;

    public AnalyticsController(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var stats = await _analyticsRepository.GetDashboardStatsAsync(Guid.Parse(userId));
        return Ok(stats);
    }

    [HttpGet("patients-by-goal")]
    public async Task<ActionResult<IEnumerable<PatientsByGoalDto>>> GetPatientsByGoal()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var data = await _analyticsRepository.GetPatientsByGoalAsync(Guid.Parse(userId));
        return Ok(data);
    }

    [HttpGet("top-progress")]
    public async Task<ActionResult<IEnumerable<PatientProgressDto>>> GetTopProgress([FromQuery] int limit = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var data = await _analyticsRepository.GetTopProgressPatientsAsync(Guid.Parse(userId), limit);
        return Ok(data);
    }

    [HttpGet("inactive-patients")]
    public async Task<ActionResult<IEnumerable<InactivePatientDto>>> GetInactivePatients([FromQuery] int daysThreshold = 30)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var data = await _analyticsRepository.GetInactivePatientsAsync(Guid.Parse(userId), daysThreshold);
        return Ok(data);
    }

    [HttpGet("bmi-distribution")]
    public async Task<ActionResult<IEnumerable<BMIDistributionDto>>> GetBMIDistribution()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var data = await _analyticsRepository.GetBMIDistributionAsync(Guid.Parse(userId));
        return Ok(data);
    }
}