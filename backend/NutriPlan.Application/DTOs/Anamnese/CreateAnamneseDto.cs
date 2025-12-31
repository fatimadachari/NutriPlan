using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NutriPlan.Application.DTOs.Anamnese
{
    public class CreateAnamneseDto
    {
        [Required]
        public Guid PatientId { get; set; }

        // Step 1: Dados Pessoais & Objetivos
        [Required(ErrorMessage = "Queixa principal é obrigatória")]
        [MaxLength(500)]
        public string MainComplaint { get; set; } = string.Empty;

        [Required(ErrorMessage = "Objetivo da consulta é obrigatório")]
        [MaxLength(500)]
        public string ConsultationGoal { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Expectations { get; set; } = string.Empty;

        // Step 2: Histórico de Saúde
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

        // Step 3: Hábitos Alimentares
        [Range(1, 10, ErrorMessage = "Número de refeições deve estar entre 1 e 10")]
        public int MealsPerDay { get; set; }

        [MaxLength(300)]
        public string? MealTimes { get; set; }

        [MaxLength(1000)]
        public string? FoodPreferences { get; set; }

        [MaxLength(1000)]
        public string? DislikedFoods { get; set; }

        [MaxLength(1000)]
        public string? FoodIntolerances { get; set; }

        [Range(0, 10, ErrorMessage = "Consumo de água deve estar entre 0 e 10 litros")]
        public decimal WaterIntakeLiters { get; set; }

        [Required]
        [MaxLength(50)]
        public string AlcoholConsumption { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string FastFoodFrequency { get; set; } = string.Empty;

        // Step 4: Estilo de Vida
        [Range(0, 24, ErrorMessage = "Horas de sono deve estar entre 0 e 24")]
        public decimal SleepHoursPerDay { get; set; }

        [Range(1, 10, ErrorMessage = "Nível de estresse deve estar entre 1 e 10")]
        public int StressLevel { get; set; }

        [MaxLength(500)]
        public string? PhysicalActivity { get; set; }

        [MaxLength(500)]
        public string? WorkRoutine { get; set; }

        public bool IsSmoker { get; set; }

        // Step 5: Exames & Observações
        [MaxLength(2000)]
        public string? PreviousDiets { get; set; }

        [MaxLength(2000)]
        public string? AdditionalObservations { get; set; }

        public List<string> ExamFiles { get; set; } = new();
    }
}