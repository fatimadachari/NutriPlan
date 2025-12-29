using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class DietConfiguration : IEntityTypeConfiguration<Diet>
{
    public void Configure(EntityTypeBuilder<Diet> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.TotalCalories)
            .HasPrecision(8, 2);

        builder.Property(d => d.TotalProtein)
            .HasPrecision(8, 2);

        builder.Property(d => d.TotalCarbs)
            .HasPrecision(8, 2);

        builder.Property(d => d.TotalFat)
            .HasPrecision(8, 2);

        builder.HasMany(d => d.Meals)
            .WithOne(m => m.Diet)
            .HasForeignKey(m => m.DietId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}