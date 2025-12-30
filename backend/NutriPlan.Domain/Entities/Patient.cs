namespace NutriPlan.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public int Age { get; private set; }
    public decimal Weight { get; private set; }
    public decimal Height { get; private set; }
    public string Goal { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Guid NutritionistId { get; private set; }
    public Nutritionist Nutritionist { get; private set; }
    public string Gender { get; private set; } // "M" ou "F"
    public string ActivityLevel { get; private set; } // "Sedentary", "Light", "Moderate", "Active", "VeryActive"
    public decimal? TargetWeight { get; private set; }
    public DateTime? TargetDate { get; private set; } 

    public ICollection<Diet> Diets { get; private set; }
    public ICollection<PatientAllergy> PatientAllergies { get; private set; }
    public ICollection<PatientHealthCondition> PatientHealthConditions { get; private set; }
    public ICollection<PatientDietaryPreference> PatientDietaryPreferences { get; private set; }
    public ICollection<WeightHistory> WeightHistories { get; private set; }
    public ICollection<BodyMeasurement> BodyMeasurements { get; private set; }

    public Patient(
        string name,
        string email,
        int age,
        decimal weight,
        decimal height,
        string goal,
        Guid nutritionistId,
        string gender,
        string activityLevel,
        decimal? targetWeight = null,
        DateTime? targetDate = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        Age = age;
        Weight = weight;
        Height = height;
        Goal = goal;
        NutritionistId = nutritionistId;
        Gender = gender;
        ActivityLevel = activityLevel;
        TargetWeight = targetWeight;
        TargetDate = targetDate;
        CreatedAt = DateTime.UtcNow;
        Diets = new List<Diet>();
        PatientAllergies = new List<PatientAllergy>();
        PatientHealthConditions = new List<PatientHealthCondition>();
        PatientDietaryPreferences = new List<PatientDietaryPreference>();
        WeightHistories = new List<WeightHistory>();
        BodyMeasurements = new List<BodyMeasurement>();
    }

    private Patient()
    {
        PatientAllergies = new List<PatientAllergy>();
        PatientHealthConditions = new List<PatientHealthCondition>();
        PatientDietaryPreferences = new List<PatientDietaryPreference>();
        WeightHistories = new List<WeightHistory>();
        BodyMeasurements = new List<BodyMeasurement>();
    }

    public decimal CalculateBMR()
    {
        // Fórmula de Mifflin-St Jeor
        // Homens: TMB = (10 × peso em kg) + (6,25 × altura em cm) - (5 × idade em anos) + 5
        // Mulheres: TMB = (10 × peso em kg) + (6,25 × altura em cm) - (5 × idade em anos) - 161

        decimal bmr = (10 * Weight) + (6.25m * Height) - (5 * Age);

        if (Gender == "M")
            bmr += 5;
        else
            bmr -= 161;

        return Math.Round(bmr, 2);
    }

    public decimal CalculateTDEE()
    {
        var bmr = CalculateBMR();

        // Multiplicadores de atividade física
        return ActivityLevel switch
        {
            "Sedentary" => Math.Round(bmr * 1.2m, 2), // Pouco ou nenhum exercício
            "Light" => Math.Round(bmr * 1.375m, 2), // Exercício leve 1-3 dias/semana
            "Moderate" => Math.Round(bmr * 1.55m, 2), // Exercício moderado 3-5 dias/semana
            "Active" => Math.Round(bmr * 1.725m, 2), // Exercício pesado 6-7 dias/semana
            "VeryActive" => Math.Round(bmr * 1.9m, 2), // Exercício muito pesado, trabalho físico
            _ => Math.Round(bmr * 1.2m, 2)
        };
    }

    public void UpdateGoalInfo(decimal? targetWeight, DateTime? targetDate)
    {
        TargetWeight = targetWeight;
        TargetDate = targetDate;
    }

    public void UpdateActivityLevel(string activityLevel)
    {
        ActivityLevel = activityLevel;
    }
}