using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class MealFoodConfiguration : IEntityTypeConfiguration<MealFood>
{
    public void Configure(EntityTypeBuilder<MealFood> builder)
    {
        builder.HasKey(mf => mf.Id);

        builder.Property(mf => mf.CalculatedCalories)
            .HasPrecision(8, 2);

        builder.Property(mf => mf.CalculatedProtein)
            .HasPrecision(8, 2);

        builder.Property(mf => mf.CalculatedCarbs)
            .HasPrecision(8, 2);

        builder.Property(mf => mf.CalculatedFat)
            .HasPrecision(8, 2);

        builder.HasOne(mf => mf.Food)
            .WithMany()
            .HasForeignKey(mf => mf.FoodId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}