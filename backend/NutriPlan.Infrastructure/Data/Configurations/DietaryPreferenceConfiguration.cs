using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class DietaryPreferenceConfiguration : IEntityTypeConfiguration<DietaryPreference>
{
    public void Configure(EntityTypeBuilder<DietaryPreference> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(d => d.Name);
    }
}