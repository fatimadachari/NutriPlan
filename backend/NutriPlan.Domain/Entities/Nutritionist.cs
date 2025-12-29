namespace NutriPlan.Domain.Entities;

public class Nutritionist
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string CRN { get; private set; } 
    public DateTime CreatedAt { get; private set; }

    public ICollection<Patient> Patients { get; private set; }

    public Nutritionist(string name, string email, string crn)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        CRN = crn;
        CreatedAt = DateTime.UtcNow;
        Patients = new List<Patient>();
    }

    private Nutritionist() { }
}