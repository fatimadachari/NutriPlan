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

    // Novas tabelas
    public DbSet<Allergy> Allergies { get; set; }
    public DbSet<HealthCondition> HealthConditions { get; set; }
    public DbSet<DietaryPreference> DietaryPreferences { get; set; }
    public DbSet<PatientAllergy> PatientAllergies { get; set; }
    public DbSet<PatientHealthCondition> PatientHealthConditions { get; set; }
    public DbSet<PatientDietaryPreference> PatientDietaryPreferences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas as configurações do assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Configurar relacionamentos N:N
        modelBuilder.Entity<PatientAllergy>()
            .HasKey(pa => new { pa.PatientId, pa.AllergyId });

        modelBuilder.Entity<PatientHealthCondition>()
            .HasKey(phc => new { phc.PatientId, phc.HealthConditionId });

        modelBuilder.Entity<PatientDietaryPreference>()
            .HasKey(pdp => new { pdp.PatientId, pdp.DietaryPreferenceId });
    }
}