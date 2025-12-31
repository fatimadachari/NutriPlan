using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Anamnese;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnamneseController : ControllerBase
    {
        private readonly IAnamneseRepository _anamneseRepository;
        private readonly IPatientRepository _patientRepository;

        public AnamneseController(
            IAnamneseRepository anamneseRepository,
            IPatientRepository patientRepository)
        {
            _anamneseRepository = anamneseRepository;
            _patientRepository = patientRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnamneseResponseDto>>> GetAll()
        {
            var anamneses = await _anamneseRepository.GetAllAsync();

            var response = anamneses.Select(a => new AnamneseResponseDto
            {
                Id = a.Id,
                PatientId = a.PatientId,
                PatientName = a.Patient.Name,
                MainComplaint = a.MainComplaint,
                ConsultationGoal = a.ConsultationGoal,
                Expectations = a.Expectations,
                FamilyHistory = a.FamilyHistory,
                PreExistingDiseases = a.PreExistingDiseases,
                PreviousSurgeries = a.PreviousSurgeries,
                CurrentMedications = a.CurrentMedications,
                Supplements = a.Supplements,
                MedicationAllergies = a.MedicationAllergies,
                MealsPerDay = a.MealsPerDay,
                MealTimes = a.MealTimes,
                FoodPreferences = a.FoodPreferences,
                DislikedFoods = a.DislikedFoods,
                FoodIntolerances = a.FoodIntolerances,
                WaterIntakeLiters = a.WaterIntakeLiters,
                AlcoholConsumption = a.AlcoholConsumption,
                FastFoodFrequency = a.FastFoodFrequency,
                SleepHoursPerDay = a.SleepHoursPerDay,
                StressLevel = a.StressLevel,
                PhysicalActivity = a.PhysicalActivity,
                WorkRoutine = a.WorkRoutine,
                IsSmoker = a.IsSmoker,
                PreviousDiets = a.PreviousDiets,
                AdditionalObservations = a.AdditionalObservations,
                ExamFiles = a.ExamFiles,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            });

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnamneseResponseDto>> GetById(Guid id)
        {
            var anamnese = await _anamneseRepository.GetByIdAsync(id);
            if (anamnese == null)
                return NotFound(new { message = "Anamnese não encontrada" });

            var response = new AnamneseResponseDto
            {
                Id = anamnese.Id,
                PatientId = anamnese.PatientId,
                PatientName = anamnese.Patient.Name,
                MainComplaint = anamnese.MainComplaint,
                ConsultationGoal = anamnese.ConsultationGoal,
                Expectations = anamnese.Expectations,
                FamilyHistory = anamnese.FamilyHistory,
                PreExistingDiseases = anamnese.PreExistingDiseases,
                PreviousSurgeries = anamnese.PreviousSurgeries,
                CurrentMedications = anamnese.CurrentMedications,
                Supplements = anamnese.Supplements,
                MedicationAllergies = anamnese.MedicationAllergies,
                MealsPerDay = anamnese.MealsPerDay,
                MealTimes = anamnese.MealTimes,
                FoodPreferences = anamnese.FoodPreferences,
                DislikedFoods = anamnese.DislikedFoods,
                FoodIntolerances = anamnese.FoodIntolerances,
                WaterIntakeLiters = anamnese.WaterIntakeLiters,
                AlcoholConsumption = anamnese.AlcoholConsumption,
                FastFoodFrequency = anamnese.FastFoodFrequency,
                SleepHoursPerDay = anamnese.SleepHoursPerDay,
                StressLevel = anamnese.StressLevel,
                PhysicalActivity = anamnese.PhysicalActivity,
                WorkRoutine = anamnese.WorkRoutine,
                IsSmoker = anamnese.IsSmoker,
                PreviousDiets = anamnese.PreviousDiets,
                AdditionalObservations = anamnese.AdditionalObservations,
                ExamFiles = anamnese.ExamFiles,
                CreatedAt = anamnese.CreatedAt,
                UpdatedAt = anamnese.UpdatedAt
            };

            return Ok(response);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<AnamneseResponseDto>> GetByPatientId(Guid patientId)
        {
            var patient = await _patientRepository.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound(new { message = "Paciente não encontrado" });

            var anamnese = await _anamneseRepository.GetByPatientIdAsync(patientId);
            if (anamnese == null)
                return NotFound(new { message = "Anamnese não encontrada para este paciente" });

            var response = new AnamneseResponseDto
            {
                Id = anamnese.Id,
                PatientId = anamnese.PatientId,
                PatientName = anamnese.Patient.Name,
                MainComplaint = anamnese.MainComplaint,
                ConsultationGoal = anamnese.ConsultationGoal,
                Expectations = anamnese.Expectations,
                FamilyHistory = anamnese.FamilyHistory,
                PreExistingDiseases = anamnese.PreExistingDiseases,
                PreviousSurgeries = anamnese.PreviousSurgeries,
                CurrentMedications = anamnese.CurrentMedications,
                Supplements = anamnese.Supplements,
                MedicationAllergies = anamnese.MedicationAllergies,
                MealsPerDay = anamnese.MealsPerDay,
                MealTimes = anamnese.MealTimes,
                FoodPreferences = anamnese.FoodPreferences,
                DislikedFoods = anamnese.DislikedFoods,
                FoodIntolerances = anamnese.FoodIntolerances,
                WaterIntakeLiters = anamnese.WaterIntakeLiters,
                AlcoholConsumption = anamnese.AlcoholConsumption,
                FastFoodFrequency = anamnese.FastFoodFrequency,
                SleepHoursPerDay = anamnese.SleepHoursPerDay,
                StressLevel = anamnese.StressLevel,
                PhysicalActivity = anamnese.PhysicalActivity,
                WorkRoutine = anamnese.WorkRoutine,
                IsSmoker = anamnese.IsSmoker,
                PreviousDiets = anamnese.PreviousDiets,
                AdditionalObservations = anamnese.AdditionalObservations,
                ExamFiles = anamnese.ExamFiles,
                CreatedAt = anamnese.CreatedAt,
                UpdatedAt = anamnese.UpdatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<AnamneseResponseDto>> Create([FromBody] CreateAnamneseDto dto)
        {
            var patient = await _patientRepository.GetByIdAsync(dto.PatientId);
            if (patient == null)
                return NotFound(new { message = "Paciente não encontrado" });

            // Verificar se já existe anamnese para este paciente
            var existingAnamnese = await _anamneseRepository.GetByPatientIdAsync(dto.PatientId);
            if (existingAnamnese != null)
                return BadRequest(new { message = "Paciente já possui anamnese cadastrada. Use o endpoint de atualização." });

            var anamnese = new Anamnese
            {
                Id = Guid.NewGuid(),
                PatientId = dto.PatientId,
                MainComplaint = dto.MainComplaint,
                ConsultationGoal = dto.ConsultationGoal,
                Expectations = dto.Expectations,
                FamilyHistory = dto.FamilyHistory,
                PreExistingDiseases = dto.PreExistingDiseases,
                PreviousSurgeries = dto.PreviousSurgeries,
                CurrentMedications = dto.CurrentMedications,
                Supplements = dto.Supplements,
                MedicationAllergies = dto.MedicationAllergies,
                MealsPerDay = dto.MealsPerDay,
                MealTimes = dto.MealTimes,
                FoodPreferences = dto.FoodPreferences,
                DislikedFoods = dto.DislikedFoods,
                FoodIntolerances = dto.FoodIntolerances,
                WaterIntakeLiters = dto.WaterIntakeLiters,
                AlcoholConsumption = dto.AlcoholConsumption,
                FastFoodFrequency = dto.FastFoodFrequency,
                SleepHoursPerDay = dto.SleepHoursPerDay,
                StressLevel = dto.StressLevel,
                PhysicalActivity = dto.PhysicalActivity,
                WorkRoutine = dto.WorkRoutine,
                IsSmoker = dto.IsSmoker,
                PreviousDiets = dto.PreviousDiets,
                AdditionalObservations = dto.AdditionalObservations,
                ExamFiles = dto.ExamFiles,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _anamneseRepository.CreateAsync(anamnese);

            var response = new AnamneseResponseDto
            {
                Id = created.Id,
                PatientId = created.PatientId,
                PatientName = created.Patient.Name,
                MainComplaint = created.MainComplaint,
                ConsultationGoal = created.ConsultationGoal,
                Expectations = created.Expectations,
                FamilyHistory = created.FamilyHistory,
                PreExistingDiseases = created.PreExistingDiseases,
                PreviousSurgeries = created.PreviousSurgeries,
                CurrentMedications = created.CurrentMedications,
                Supplements = created.Supplements,
                MedicationAllergies = created.MedicationAllergies,
                MealsPerDay = created.MealsPerDay,
                MealTimes = created.MealTimes,
                FoodPreferences = created.FoodPreferences,
                DislikedFoods = created.DislikedFoods,
                FoodIntolerances = created.FoodIntolerances,
                WaterIntakeLiters = created.WaterIntakeLiters,
                AlcoholConsumption = created.AlcoholConsumption,
                FastFoodFrequency = created.FastFoodFrequency,
                SleepHoursPerDay = created.SleepHoursPerDay,
                StressLevel = created.StressLevel,
                PhysicalActivity = created.PhysicalActivity,
                WorkRoutine = created.WorkRoutine,
                IsSmoker = created.IsSmoker,
                PreviousDiets = created.PreviousDiets,
                AdditionalObservations = created.AdditionalObservations,
                ExamFiles = created.ExamFiles,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AnamneseResponseDto>> Update(Guid id, [FromBody] UpdateAnamneseDto dto)
        {
            var anamnese = await _anamneseRepository.GetByIdAsync(id);
            if (anamnese == null)
                return NotFound(new { message = "Anamnese não encontrada" });

            // Atualizar apenas campos não-nulos
            if (dto.MainComplaint != null) anamnese.MainComplaint = dto.MainComplaint;
            if (dto.ConsultationGoal != null) anamnese.ConsultationGoal = dto.ConsultationGoal;
            if (dto.Expectations != null) anamnese.Expectations = dto.Expectations;
            if (dto.FamilyHistory != null) anamnese.FamilyHistory = dto.FamilyHistory;
            if (dto.PreExistingDiseases != null) anamnese.PreExistingDiseases = dto.PreExistingDiseases;
            if (dto.PreviousSurgeries != null) anamnese.PreviousSurgeries = dto.PreviousSurgeries;
            if (dto.CurrentMedications != null) anamnese.CurrentMedications = dto.CurrentMedications;
            if (dto.Supplements != null) anamnese.Supplements = dto.Supplements;
            if (dto.MedicationAllergies != null) anamnese.MedicationAllergies = dto.MedicationAllergies;
            if (dto.MealsPerDay.HasValue) anamnese.MealsPerDay = dto.MealsPerDay.Value;
            if (dto.MealTimes != null) anamnese.MealTimes = dto.MealTimes;
            if (dto.FoodPreferences != null) anamnese.FoodPreferences = dto.FoodPreferences;
            if (dto.DislikedFoods != null) anamnese.DislikedFoods = dto.DislikedFoods;
            if (dto.FoodIntolerances != null) anamnese.FoodIntolerances = dto.FoodIntolerances;
            if (dto.WaterIntakeLiters.HasValue) anamnese.WaterIntakeLiters = dto.WaterIntakeLiters.Value;
            if (dto.AlcoholConsumption != null) anamnese.AlcoholConsumption = dto.AlcoholConsumption;
            if (dto.FastFoodFrequency != null) anamnese.FastFoodFrequency = dto.FastFoodFrequency;
            if (dto.SleepHoursPerDay.HasValue) anamnese.SleepHoursPerDay = dto.SleepHoursPerDay.Value;
            if (dto.StressLevel.HasValue) anamnese.StressLevel = dto.StressLevel.Value;
            if (dto.PhysicalActivity != null) anamnese.PhysicalActivity = dto.PhysicalActivity;
            if (dto.WorkRoutine != null) anamnese.WorkRoutine = dto.WorkRoutine;
            if (dto.IsSmoker.HasValue) anamnese.IsSmoker = dto.IsSmoker.Value;
            if (dto.PreviousDiets != null) anamnese.PreviousDiets = dto.PreviousDiets;
            if (dto.AdditionalObservations != null) anamnese.AdditionalObservations = dto.AdditionalObservations;
            if (dto.ExamFiles != null) anamnese.ExamFiles = dto.ExamFiles;

            var updated = await _anamneseRepository.UpdateAsync(anamnese);

            var response = new AnamneseResponseDto
            {
                Id = updated.Id,
                PatientId = updated.PatientId,
                PatientName = updated.Patient.Name,
                MainComplaint = updated.MainComplaint,
                ConsultationGoal = updated.ConsultationGoal,
                Expectations = updated.Expectations,
                FamilyHistory = updated.FamilyHistory,
                PreExistingDiseases = updated.PreExistingDiseases,
                PreviousSurgeries = updated.PreviousSurgeries,
                CurrentMedications = updated.CurrentMedications,
                Supplements = updated.Supplements,
                MedicationAllergies = updated.MedicationAllergies,
                MealsPerDay = updated.MealsPerDay,
                MealTimes = updated.MealTimes,
                FoodPreferences = updated.FoodPreferences,
                DislikedFoods = updated.DislikedFoods,
                FoodIntolerances = updated.FoodIntolerances,
                WaterIntakeLiters = updated.WaterIntakeLiters,
                AlcoholConsumption = updated.AlcoholConsumption,
                FastFoodFrequency = updated.FastFoodFrequency,
                SleepHoursPerDay = updated.SleepHoursPerDay,
                StressLevel = updated.StressLevel,
                PhysicalActivity = updated.PhysicalActivity,
                WorkRoutine = updated.WorkRoutine,
                IsSmoker = updated.IsSmoker,
                PreviousDiets = updated.PreviousDiets,
                AdditionalObservations = updated.AdditionalObservations,
                ExamFiles = updated.ExamFiles,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var anamnese = await _anamneseRepository.GetByIdAsync(id);
            if (anamnese == null)
                return NotFound(new { message = "Anamnese não encontrada" });

            await _anamneseRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}