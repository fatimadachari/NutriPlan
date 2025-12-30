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

        builder.Property(p => p.Age)
            .IsRequired();

        builder.Property(p => p.Weight)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(p => p.Height)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(p => p.Goal)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Gender)
            .IsRequired()
            .HasMaxLength(1);

        builder.Property(p => p.ActivityLevel)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.TargetWeight)
            .HasPrecision(5, 2);

        builder.Property(p => p.TargetDate);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.HasOne(p => p.Nutritionist)
            .WithMany(n => n.Patients)
            .HasForeignKey(p => p.NutritionistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.Email);
    }
}