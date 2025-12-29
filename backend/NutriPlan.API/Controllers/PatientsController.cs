using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Patient;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientRepository _patientRepository;

    public PatientsController(IPatientRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientResponseDto>>> GetAll()
    {
        var patients = await _patientRepository.GetAllAsync();
        var response = patients.Select(p => MapToPatientResponse(p));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientResponseDto>> GetById(Guid id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var response = MapToPatientResponse(patient);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<PatientResponseDto>> Create([FromBody] CreatePatientDto dto)
    {
        var patient = new Patient(
            dto.Name,
            dto.Email,
            dto.Age,
            dto.Weight,
            dto.Height,
            dto.Goal,
            dto.NutritionistId
        );

        var created = await _patientRepository.CreateAsync(patient);

        var response = MapToPatientResponse(created);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PatientResponseDto>> Update(Guid id, [FromBody] UpdatePatientDto dto)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var updated = new Patient(
            dto.Name,
            dto.Email,
            dto.Age,
            dto.Weight,
            dto.Height,
            dto.Goal,
            patient.NutritionistId
        );

        typeof(Patient).GetProperty("Id")!.SetValue(updated, id);

        await _patientRepository.UpdateAsync(updated);

        var response = MapToPatientResponse(updated);
        return Ok(response);
    }

    [HttpPut("{id}/restrictions")]
    public async Task<ActionResult> UpdateRestrictions(Guid id, [FromBody] UpdatePatientRestrictionsDto dto)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        await _patientRepository.UpdateRestrictionsAsync(
            id,
            dto.AllergyIds,
            dto.HealthConditionIds,
            dto.DietaryPreferenceIds
        );

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        await _patientRepository.DeleteAsync(id);
        return NoContent();
    }

    private PatientResponseDto MapToPatientResponse(Patient patient)
    {
        return new PatientResponseDto
        {
            Id = patient.Id,
            Name = patient.Name,
            Email = patient.Email,
            Age = patient.Age,
            Weight = patient.Weight,
            Height = patient.Height,
            Goal = patient.Goal,
            NutritionistId = patient.NutritionistId,
            CreatedAt = patient.CreatedAt,
            Allergies = patient.PatientAllergies.Select(pa => new AllergyDto
            {
                Id = pa.Allergy.Id,
                Name = pa.Allergy.Name,
                Category = pa.Allergy.Category
            }).ToList(),
            HealthConditions = patient.PatientHealthConditions.Select(phc => new HealthConditionDto
            {
                Id = phc.HealthCondition.Id,
                Name = phc.HealthCondition.Name,
                Description = phc.HealthCondition.Description
            }).ToList(),
            DietaryPreferences = patient.PatientDietaryPreferences.Select(pdp => new DietaryPreferenceDto
            {
                Id = pdp.DietaryPreference.Id,
                Name = pdp.DietaryPreference.Name
            }).ToList()
        };
    }
}