using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NutriPlan.Application.DTOs.Auth;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;
using NutriPlan.Infrastructure.Identity;

namespace NutriPlan.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext context)
    {
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            return null;

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
            return null;

        // Criar Nutritionist correspondente
        var nutritionist = new Nutritionist(dto.FullName, dto.Email, dto.CRN);
        typeof(Nutritionist).GetProperty("Id")!.SetValue(nutritionist, user.Id);

        await _context.Nutritionists.AddAsync(nutritionist);
        await _context.SaveChangesAsync();

        return await GenerateTokenAsync(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return null;

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
            return null;

        return await GenerateTokenAsync(user);
    }

    private Task<AuthResponseDto> GenerateTokenAsync(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey não configurada");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.FullName),
            new("crn", user.CRN)
        };

        var expiresAt = DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpirationInHours"] ?? "24"));

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Task.FromResult(new AuthResponseDto
        {
            Token = tokenString,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            UserId = user.Id,
            ExpiresAt = expiresAt
        });
    }
}