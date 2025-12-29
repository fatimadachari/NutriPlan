using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class PatientDietaryPreferenceConfiguration : IEntityTypeConfiguration<PatientDietaryPreference>
{
    public void Configure(EntityTypeBuilder<PatientDietaryPreference> builder)
    {
        builder.HasKey(pdp => new { pdp.PatientId, pdp.DietaryPreferenceId });

        builder.HasOne(pdp => pdp.Patient)
            .WithMany(p => p.PatientDietaryPreferences)
            .HasForeignKey(pdp => pdp.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pdp => pdp.DietaryPreference)
            .WithMany()
            .HasForeignKey(pdp => pdp.DietaryPreferenceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}