using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Infrastructure.Data.Configurations;

public class BodyMeasurementConfiguration : IEntityTypeConfiguration<BodyMeasurement>
{
    public void Configure(EntityTypeBuilder<BodyMeasurement> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.MeasurementDate)
            .IsRequired();

        // Todas as medidas são opcionais e com precisão
        builder.Property(b => b.Neck).HasPrecision(5, 2);
        builder.Property(b => b.Chest).HasPrecision(5, 2);
        builder.Property(b => b.Waist).HasPrecision(5, 2);
        builder.Property(b => b.Abdomen).HasPrecision(5, 2);
        builder.Property(b => b.Hip).HasPrecision(5, 2);
        builder.Property(b => b.RightArm).HasPrecision(5, 2);
        builder.Property(b => b.LeftArm).HasPrecision(5, 2);
        builder.Property(b => b.RightThigh).HasPrecision(5, 2);
        builder.Property(b => b.LeftThigh).HasPrecision(5, 2);
        builder.Property(b => b.RightCalf).HasPrecision(5, 2);
        builder.Property(b => b.LeftCalf).HasPrecision(5, 2);
        builder.Property(b => b.BodyFatPercentage).HasPrecision(5, 2);
        builder.Property(b => b.MuscleMassPercentage).HasPrecision(5, 2);

        builder.Property(b => b.Notes)
            .HasMaxLength(1000);

        builder.HasOne(b => b.Patient)
            .WithMany(p => p.BodyMeasurements)
            .HasForeignKey(b => b.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(b => new { b.PatientId, b.MeasurementDate });
    }
}