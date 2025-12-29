using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class PatientAllergyConfiguration : IEntityTypeConfiguration<PatientAllergy>
{
    public void Configure(EntityTypeBuilder<PatientAllergy> builder)
    {
        builder.HasKey(pa => new { pa.PatientId, pa.AllergyId });

        builder.HasOne(pa => pa.Patient)
            .WithMany(p => p.PatientAllergies)
            .HasForeignKey(pa => pa.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pa => pa.Allergy)
            .WithMany()
            .HasForeignKey(pa => pa.AllergyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}