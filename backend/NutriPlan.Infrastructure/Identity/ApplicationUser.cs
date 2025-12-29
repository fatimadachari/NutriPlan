using Microsoft.AspNetCore.Identity;

namespace NutriPlan.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public string CRN { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}