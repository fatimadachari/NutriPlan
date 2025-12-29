using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class MealConfiguration : IEntityTypeConfiguration<Meal>
{
    public void Configure(EntityTypeBuilder<Meal> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.TotalCalories)
            .HasPrecision(8, 2);

        builder.Property(m => m.TotalProtein)
            .HasPrecision(8, 2);

        builder.Property(m => m.TotalCarbs)
            .HasPrecision(8, 2);

        builder.Property(m => m.TotalFat)
            .HasPrecision(8, 2);

        builder.HasMany(m => m.MealFoods)
            .WithOne(mf => mf.Meal)
            .HasForeignKey(mf => mf.MealId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}