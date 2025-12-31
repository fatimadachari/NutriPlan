using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NutriPlan.Application.DTOs.Anamnese
{
    public class UpdateAnamneseDto
    {
        [MaxLength(500)]
        public string? MainComplaint { get; set; }

        [MaxLength(500)]
        public string? ConsultationGoal { get; set; }

        [MaxLength(500)]
        public string? Expectations { get; set; }

        [MaxLength(1000)]
        public string? FamilyHistory { get; set; }

        [MaxLength(1000)]
        public string? PreExistingDiseases { get; set; }

        [MaxLength(1000)]
        public string? PreviousSurgeries { get; set; }

        [MaxLength(1000)]
        public string? CurrentMedications { get; set; }

        [MaxLength(500)]
        public string? Supplements { get; set; }

        [MaxLength(500)]
        public string? MedicationAllergies { get; set; }

        [Range(1, 10)]
        public int? MealsPerDay { get; set; }

        [MaxLength(300)]
        public string? MealTimes { get; set; }

        [MaxLength(1000)]
        public string? FoodPreferences { get; set; }

        [MaxLength(1000)]
        public string? DislikedFoods { get; set; }

        [MaxLength(1000)]
        public string? FoodIntolerances { get; set; }

        [Range(0, 10)]
        public decimal? WaterIntakeLiters { get; set; }

        [MaxLength(50)]
        public string? AlcoholConsumption { get; set; }

        [MaxLength(50)]
        public string? FastFoodFrequency { get; set; }

        [Range(0, 24)]
        public decimal? SleepHoursPerDay { get; set; }

        [Range(1, 10)]
        public int? StressLevel { get; set; }

        [MaxLength(500)]
        public string? PhysicalActivity { get; set; }

        [MaxLength(500)]
        public string? WorkRoutine { get; set; }

        public bool? IsSmoker { get; set; }

        [MaxLength(2000)]
        public string? PreviousDiets { get; set; }

        [MaxLength(2000)]
        public string? AdditionalObservations { get; set; }

        public List<string>? ExamFiles { get; set; }
    }
}