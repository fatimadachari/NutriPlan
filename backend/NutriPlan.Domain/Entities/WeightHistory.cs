namespace NutriPlan.Domain.Entities;

public class WeightHistory
{
    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public Patient Patient { get; private set; } = null!;

    public decimal Weight { get; private set; }
    public decimal BMI { get; private set; } // IMC calculado
    public DateTime MeasurementDate { get; private set; }
    public string? Notes { get; private set; }

    public WeightHistory(Guid patientId, decimal weight, decimal height, DateTime measurementDate, string? notes = null)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        Weight = weight;
        BMI = CalculateBMI(weight, height);
        MeasurementDate = measurementDate;
        Notes = notes;
    }

    private WeightHistory() { }

    private static decimal CalculateBMI(decimal weight, decimal heightInCm)
    {
        var heightInMeters = heightInCm / 100;
        return Math.Round(weight / (heightInMeters * heightInMeters), 2);
    }

    public void Update(decimal weight, decimal height, DateTime measurementDate, string? notes)
    {
        Weight = weight;
        BMI = CalculateBMI(weight, height);
        MeasurementDate = measurementDate;
        Notes = notes;
    }
}