using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class PatientHealthConditionConfiguration : IEntityTypeConfiguration<PatientHealthCondition>
{
    public void Configure(EntityTypeBuilder<PatientHealthCondition> builder)
    {
        builder.HasKey(phc => new { phc.PatientId, phc.HealthConditionId });

        builder.HasOne(phc => phc.Patient)
            .WithMany(p => p.PatientHealthConditions)
            .HasForeignKey(phc => phc.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(phc => phc.HealthCondition)
            .WithMany()
            .HasForeignKey(phc => phc.HealthConditionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(phc => phc.Notes)
            .HasMaxLength(500);
    }
}