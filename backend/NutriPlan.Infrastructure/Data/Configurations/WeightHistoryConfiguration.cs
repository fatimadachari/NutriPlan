using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class WeightHistoryConfiguration : IEntityTypeConfiguration<WeightHistory>
{
    public void Configure(EntityTypeBuilder<WeightHistory> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.Weight)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(w => w.BMI)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(w => w.MeasurementDate)
            .IsRequired();

        builder.Property(w => w.Notes)
            .HasMaxLength(500);

        builder.HasOne(w => w.Patient)
            .WithMany(p => p.WeightHistories)
            .HasForeignKey(w => w.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(w => new { w.PatientId, w.MeasurementDate });
    }
}