namespace NutriPlan.Domain.Entities;

public class Diet
{
    public Guid Id { get; private set; }
    public DateTime CreatedDate { get; private set; }
    public decimal TotalCalories { get; private set; }
    public decimal TotalProtein { get; private set; }
    public decimal TotalCarbs { get; private set; }
    public decimal TotalFat { get; private set; }

    public Guid PatientId { get; private set; }
    public Patient Patient { get; private set; }

    public ICollection<Meal> Meals { get; private set; }

    public Diet(Guid patientId)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        CreatedDate = DateTime.UtcNow;
        Meals = new List<Meal>();
    }

    public void RecalculateTotals()
    {
        TotalCalories = Meals.Sum(m => m.TotalCalories);
        TotalProtein = Meals.Sum(m => m.TotalProtein);
        TotalCarbs = Meals.Sum(m => m.TotalCarbs);
        TotalFat = Meals.Sum(m => m.TotalFat);
    }

    private Diet() { }
}