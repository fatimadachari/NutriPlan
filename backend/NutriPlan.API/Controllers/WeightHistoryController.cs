using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.WeightHistory;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WeightHistoryController : ControllerBase
{
    private readonly IWeightHistoryRepository _weightHistoryRepository;
    private readonly IPatientRepository _patientRepository;

    public WeightHistoryController(IWeightHistoryRepository weightHistoryRepository, IPatientRepository patientRepository)
    {
        _weightHistoryRepository = weightHistoryRepository;
        _patientRepository = patientRepository;
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<WeightHistoryResponseDto>>> GetByPatient(Guid patientId)
    {
        var weights = await _weightHistoryRepository.GetByPatientIdAsync(patientId);
        var response = weights.Select(w => new WeightHistoryResponseDto
        {
            Id = w.Id,
            PatientId = w.PatientId,
            Weight = w.Weight,
            BMI = w.BMI,
            MeasurementDate = w.MeasurementDate,
            Notes = w.Notes
        });

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<WeightHistoryResponseDto>> Create([FromBody] CreateWeightHistoryDto dto)
    {
        var patient = await _patientRepository.GetByIdAsync(dto.PatientId);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var weightHistory = new WeightHistory(
            dto.PatientId,
            dto.Weight,
            patient.Height,
            dto.MeasurementDate,
            dto.Notes
        );

        var created = await _weightHistoryRepository.CreateAsync(weightHistory);

        var response = new WeightHistoryResponseDto
        {
            Id = created.Id,
            PatientId = created.PatientId,
            Weight = created.Weight,
            BMI = created.BMI,
            MeasurementDate = created.MeasurementDate,
            Notes = created.Notes
        };

        return CreatedAtAction(nameof(GetByPatient), new { patientId = created.PatientId }, response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var weightHistory = await _weightHistoryRepository.GetByIdAsync(id);
        if (weightHistory == null)
            return NotFound(new { message = "Registro não encontrado" });

        await _weightHistoryRepository.DeleteAsync(id);
        return NoContent();
    }
}