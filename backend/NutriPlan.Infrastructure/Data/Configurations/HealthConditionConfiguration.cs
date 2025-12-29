using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class HealthConditionConfiguration : IEntityTypeConfiguration<HealthCondition>
{
    public void Configure(EntityTypeBuilder<HealthCondition> builder)
    {
        builder.HasKey(h => h.Id);

        builder.Property(h => h.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(h => h.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(h => h.Name);
    }
}