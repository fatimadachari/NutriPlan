using NutriPlan.Application.Common;
using NutriPlan.Application.DTOs.Auth;

namespace NutriPlan.Application.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto);
    Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto);
}