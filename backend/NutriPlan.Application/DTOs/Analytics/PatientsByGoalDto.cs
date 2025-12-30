namespace NutriPlan.Application.DTOs.Analytics;

public class PatientsByGoalDto
{
    public string Goal { get; set; } = string.Empty;
    public int Count { get; set; }
}