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

    public ICollection<Diet> Diets { get; private set; }
    public ICollection<PatientAllergy> PatientAllergies { get; private set; }
    public ICollection<PatientHealthCondition> PatientHealthConditions { get; private set; }
    public ICollection<PatientDietaryPreference> PatientDietaryPreferences { get; private set; }
    public ICollection<WeightHistory> WeightHistories { get; private set; }
    public ICollection<BodyMeasurement> BodyMeasurements { get; private set; }

    public Patient(string name, string email, int age, decimal weight, decimal height, string goal, Guid nutritionistId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        Age = age;
        Weight = weight;
        Height = height;
        Goal = goal;
        NutritionistId = nutritionistId;
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
}