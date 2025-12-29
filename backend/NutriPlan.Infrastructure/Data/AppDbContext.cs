using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Identity;

namespace NutriPlan.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Nutritionist> Nutritionists { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Food> Foods { get; set; }
    public DbSet<Diet> Diets { get; set; }
    public DbSet<Meal> Meals { get; set; }
    public DbSet<MealFood> MealFoods { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}