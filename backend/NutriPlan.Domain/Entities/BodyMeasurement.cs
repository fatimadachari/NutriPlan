namespace NutriPlan.Domain.Entities;

public class BodyMeasurement
{
    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public Patient Patient { get; private set; } = null!;

    public DateTime MeasurementDate { get; private set; }

    // Medidas em centímetros
    public decimal? Neck { get; private set; } // Pescoço
    public decimal? Chest { get; private set; } // Peitoral
    public decimal? Waist { get; private set; } // Cintura
    public decimal? Abdomen { get; private set; } // Abdômen
    public decimal? Hip { get; private set; } // Quadril
    public decimal? RightArm { get; private set; } // Braço direito
    public decimal? LeftArm { get; private set; } // Braço esquerdo
    public decimal? RightThigh { get; private set; } // Coxa direita
    public decimal? LeftThigh { get; private set; } // Coxa esquerda
    public decimal? RightCalf { get; private set; } // Panturrilha direita
    public decimal? LeftCalf { get; private set; } // Panturrilha esquerda

    // Composição corporal (opcional)
    public decimal? BodyFatPercentage { get; private set; } // % de gordura
    public decimal? MuscleMassPercentage { get; private set; } // % de massa muscular

    public string? Notes { get; private set; }

    public BodyMeasurement(
        Guid patientId,
        DateTime measurementDate,
        decimal? neck = null,
        decimal? chest = null,
        decimal? waist = null,
        decimal? abdomen = null,
        decimal? hip = null,
        decimal? rightArm = null,
        decimal? leftArm = null,
        decimal? rightThigh = null,
        decimal? leftThigh = null,
        decimal? rightCalf = null,
        decimal? leftCalf = null,
        decimal? bodyFatPercentage = null,
        decimal? muscleMassPercentage = null,
        string? notes = null)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        MeasurementDate = measurementDate;
        Neck = neck;
        Chest = chest;
        Waist = waist;
        Abdomen = abdomen;
        Hip = hip;
        RightArm = rightArm;
        LeftArm = leftArm;
        RightThigh = rightThigh;
        LeftThigh = leftThigh;
        RightCalf = rightCalf;
        LeftCalf = leftCalf;
        BodyFatPercentage = bodyFatPercentage;
        MuscleMassPercentage = muscleMassPercentage;
        Notes = notes;
    }

    private BodyMeasurement() { }
}