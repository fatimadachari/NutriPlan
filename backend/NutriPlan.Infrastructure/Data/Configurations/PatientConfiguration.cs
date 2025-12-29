using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Goal)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Weight)
            .HasPrecision(5, 2);

        builder.Property(p => p.Height)
            .HasPrecision(5, 2);

        builder.HasMany(p => p.Diets)
            .WithOne(d => d.Patient)
            .HasForeignKey(d => d.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}