using System.ComponentModel.DataAnnotations;

namespace NutriPlan.Application.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Nome completo é obrigatório")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 200 caracteres")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Senha deve ter no mínimo 8 caracteres")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]).{8,}$",
        ErrorMessage = "Senha deve conter: letra maiúscula, minúscula, número e caractere especial")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "CRN é obrigatório")]
    [RegularExpression(@"^\d{1,6}\/[A-Z]{2}$", ErrorMessage = "CRN deve estar no formato: 12345/UF")]
    public string CRN { get; set; } = string.Empty;
}