using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class FoodConfiguration : IEntityTypeConfiguration<Food>
{
    public void Configure(EntityTypeBuilder<Food> builder)
    {
        builder.HasKey(f => f.Id);

        builder.Property(f => f.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(f => f.Name);

        builder.Property(f => f.Calories)
            .HasPrecision(6, 2);

        builder.Property(f => f.Protein)
            .HasPrecision(6, 2);

        builder.Property(f => f.Carbs)
            .HasPrecision(6, 2);

        builder.Property(f => f.Fat)
            .HasPrecision(6, 2);
    }
}