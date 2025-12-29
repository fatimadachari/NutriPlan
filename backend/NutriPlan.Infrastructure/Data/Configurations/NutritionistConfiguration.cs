using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class NutritionistConfiguration : IEntityTypeConfiguration<Nutritionist>
{
    public void Configure(EntityTypeBuilder<Nutritionist> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(n => n.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(n => n.Email)
            .IsUnique();

        builder.Property(n => n.CRN)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(n => n.CRN)
            .IsUnique();

        builder.HasMany(n => n.Patients)
            .WithOne(p => p.Nutritionist)
            .HasForeignKey(p => p.NutritionistId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}