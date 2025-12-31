using System;
using System.Collections.Generic;

namespace NutriPlan.Domain.Entities
{
    public class Anamnese
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        // Step 1: Dados Pessoais & Objetivos
        public string MainComplaint { get; set; } = string.Empty;
        public string ConsultationGoal { get; set; } = string.Empty;
        public string Expectations { get; set; } = string.Empty;

        // Step 2: Histórico de Saúde
        public string? FamilyHistory { get; set; }
        public string? PreExistingDiseases { get; set; }
        public string? PreviousSurgeries { get; set; }
        public string? CurrentMedications { get; set; }
        public string? Supplements { get; set; }
        public string? MedicationAllergies { get; set; }

        // Step 3: Hábitos Alimentares
        public int MealsPerDay { get; set; }
        public string? MealTimes { get; set; }
        public string? FoodPreferences { get; set; }
        public string? DislikedFoods { get; set; }
        public string? FoodIntolerances { get; set; }
        public decimal WaterIntakeLiters { get; set; }
        public string AlcoholConsumption { get; set; } = string.Empty; // Nunca, Raramente, Moderado, Frequente
        public string FastFoodFrequency { get; set; } = string.Empty; // Nunca, Raramente, 1-2x/semana, 3+x/semana

        // Step 4: Estilo de Vida
        public decimal SleepHoursPerDay { get; set; }
        public int StressLevel { get; set; } // 1-10
        public string? PhysicalActivity { get; set; } // Tipo e frequência
        public string? WorkRoutine { get; set; }
        public bool IsSmoker { get; set; }

        // Step 5: Exames & Observações
        public string? PreviousDiets { get; set; }
        public string? AdditionalObservations { get; set; }
        public List<string> ExamFiles { get; set; } = new(); // URLs dos arquivos

        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}