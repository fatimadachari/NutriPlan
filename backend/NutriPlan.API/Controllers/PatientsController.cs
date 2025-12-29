using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.Patient;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

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
        var response = patients.Select(p => new PatientResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Email = p.Email,
            Age = p.Age,
            Weight = p.Weight,
            Height = p.Height,
            Goal = p.Goal,
            NutritionistId = p.NutritionistId,
            CreatedAt = p.CreatedAt
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientResponseDto>> GetById(Guid id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var response = new PatientResponseDto
        {
            Id = patient.Id,
            Name = patient.Name,
            Email = patient.Email,
            Age = patient.Age,
            Weight = patient.Weight,
            Height = patient.Height,
            Goal = patient.Goal,
            NutritionistId = patient.NutritionistId,
            CreatedAt = patient.CreatedAt
        };

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

        var response = new PatientResponseDto
        {
            Id = created.Id,
            Name = created.Name,
            Email = created.Email,
            Age = created.Age,
            Weight = created.Weight,
            Height = created.Height,
            Goal = created.Goal,
            NutritionistId = created.NutritionistId,
            CreatedAt = created.CreatedAt
        };

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

        var response = new PatientResponseDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Email = updated.Email,
            Age = updated.Age,
            Weight = updated.Weight,
            Height = updated.Height,
            Goal = updated.Goal,
            NutritionistId = updated.NutritionistId,
            CreatedAt = patient.CreatedAt
        };

        return Ok(response);
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
}