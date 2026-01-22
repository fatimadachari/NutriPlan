using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Auth;
using NutriPlan.Application.Interfaces;

namespace NutriPlan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(dto);

        if (!result.Success)
        {
            if (result.Errors != null)
                return BadRequest(new { errors = result.Errors });

            return BadRequest(new { message = result.Error });
        }

        return Ok(result.Data);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(dto);

        if (!result.Success)
            return Unauthorized(new { message = result.Error });

        return Ok(result.Data);
    }
}