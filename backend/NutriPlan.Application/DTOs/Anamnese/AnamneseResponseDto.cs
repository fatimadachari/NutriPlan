using System;
using System.Collections.Generic;

namespace NutriPlan.Application.DTOs.Anamnese
{
    public class AnamneseResponseDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;

        public string MainComplaint { get; set; } = string.Empty;
        public string ConsultationGoal { get; set; } = string.Empty;
        public string Expectations { get; set; } = string.Empty;

        public string? FamilyHistory { get; set; }
        public string? PreExistingDiseases { get; set; }
        public string? PreviousSurgeries { get; set; }
        public string? CurrentMedications { get; set; }
        public string? Supplements { get; set; }
        public string? MedicationAllergies { get; set; }

        public int MealsPerDay { get; set; }
        public string? MealTimes { get; set; }
        public string? FoodPreferences { get; set; }
        public string? DislikedFoods { get; set; }
        public string? FoodIntolerances { get; set; }
        public decimal WaterIntakeLiters { get; set; }
        public string AlcoholConsumption { get; set; } = string.Empty;
        public string FastFoodFrequency { get; set; } = string.Empty;

        public decimal SleepHoursPerDay { get; set; }
        public int StressLevel { get; set; }
        public string? PhysicalActivity { get; set; }
        public string? WorkRoutine { get; set; }
        public bool IsSmoker { get; set; }

        public string? PreviousDiets { get; set; }
        public string? AdditionalObservations { get; set; }
        public List<string> ExamFiles { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}