using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Common;
using NutriPlan.Application.DTOs.Auth;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;
using NutriPlan.Infrastructure.Identity;

namespace NutriPlan.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        AppDbContext context,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userManager = userManager;
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            return Result<AuthResponseDto>.Fail("Email já cadastrado");

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            CRN = dto.CRN,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description }
            );
            return Result<AuthResponseDto>.Fail(errors);
        }

        var nutritionist = new Nutritionist(dto.FullName, dto.Email, dto.CRN);
        typeof(Nutritionist).GetProperty("Id")!.SetValue(nutritionist, user.Id);

        await _context.Nutritionists.AddAsync(nutritionist);
        await _context.SaveChangesAsync();

        var authResponse = GenerateAuthResponse(user);
        return Result<AuthResponseDto>.Ok(authResponse);
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Result<AuthResponseDto>.Fail("Credenciais inválidas");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
            return Result<AuthResponseDto>.Fail("Credenciais inválidas");

        var authResponse = GenerateAuthResponse(user);
        return Result<AuthResponseDto>.Ok(authResponse);
    }

    private AuthResponseDto GenerateAuthResponse(ApplicationUser user)
    {
        var token = _jwtTokenGenerator.GenerateToken(
            user.Id,
            user.Email ?? string.Empty,
            user.FullName,
            user.CRN
        );
        var expiresAt = _jwtTokenGenerator.GetTokenExpiration();

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            UserId = user.Id,
            ExpiresAt = expiresAt
        };
    }
}