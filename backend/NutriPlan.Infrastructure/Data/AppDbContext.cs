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
    public DbSet<WeightHistory> WeightHistories { get; set; }
    public DbSet<BodyMeasurement> BodyMeasurements { get; set; }
    public DbSet<Allergy> Allergies { get; set; }
    public DbSet<HealthCondition> HealthConditions { get; set; }
    public DbSet<DietaryPreference> DietaryPreferences { get; set; }
    public DbSet<PatientAllergy> PatientAllergies { get; set; }
    public DbSet<PatientHealthCondition> PatientHealthConditions { get; set; }
    public DbSet<PatientDietaryPreference> PatientDietaryPreferences { get; set; }
    public DbSet<Anamnese> Anamneses { get; set; } // ✅ Adicionado

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

        // ✅ Configuração da Anamnese
        modelBuilder.Entity<Anamnese>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(a => a.MainComplaint).IsRequired().HasMaxLength(500);
            entity.Property(a => a.ConsultationGoal).IsRequired().HasMaxLength(500);
            entity.Property(a => a.Expectations).HasMaxLength(500);
            entity.Property(a => a.FamilyHistory).HasMaxLength(1000);
            entity.Property(a => a.PreExistingDiseases).HasMaxLength(1000);
            entity.Property(a => a.PreviousSurgeries).HasMaxLength(1000);
            entity.Property(a => a.CurrentMedications).HasMaxLength(1000);
            entity.Property(a => a.Supplements).HasMaxLength(500);
            entity.Property(a => a.MedicationAllergies).HasMaxLength(500);
            entity.Property(a => a.MealTimes).HasMaxLength(300);
            entity.Property(a => a.FoodPreferences).HasMaxLength(1000);
            entity.Property(a => a.DislikedFoods).HasMaxLength(1000);
            entity.Property(a => a.FoodIntolerances).HasMaxLength(1000);
            entity.Property(a => a.AlcoholConsumption).IsRequired().HasMaxLength(50);
            entity.Property(a => a.FastFoodFrequency).IsRequired().HasMaxLength(50);
            entity.Property(a => a.PhysicalActivity).HasMaxLength(500);
            entity.Property(a => a.WorkRoutine).HasMaxLength(500);
            entity.Property(a => a.PreviousDiets).HasMaxLength(2000);
            entity.Property(a => a.AdditionalObservations).HasMaxLength(2000);

            entity.Property(a => a.WaterIntakeLiters).HasPrecision(4, 2);
            entity.Property(a => a.SleepHoursPerDay).HasPrecision(4, 2);

            entity.Property(a => a.CreatedAt).IsRequired();
        });
    }
}