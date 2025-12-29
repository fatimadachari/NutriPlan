using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.DTOs.BodyMeasurement;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BodyMeasurementsController : ControllerBase
{
    private readonly IBodyMeasurementRepository _bodyMeasurementRepository;
    private readonly IPatientRepository _patientRepository;

    public BodyMeasurementsController(IBodyMeasurementRepository bodyMeasurementRepository, IPatientRepository patientRepository)
    {
        _bodyMeasurementRepository = bodyMeasurementRepository;
        _patientRepository = patientRepository;
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<BodyMeasurementResponseDto>>> GetByPatient(Guid patientId)
    {
        var measurements = await _bodyMeasurementRepository.GetByPatientIdAsync(patientId);
        var response = measurements.Select(m => new BodyMeasurementResponseDto
        {
            Id = m.Id,
            PatientId = m.PatientId,
            MeasurementDate = m.MeasurementDate,
            Neck = m.Neck,
            Chest = m.Chest,
            Waist = m.Waist,
            Abdomen = m.Abdomen,
            Hip = m.Hip,
            RightArm = m.RightArm,
            LeftArm = m.LeftArm,
            RightThigh = m.RightThigh,
            LeftThigh = m.LeftThigh,
            RightCalf = m.RightCalf,
            LeftCalf = m.LeftCalf,
            BodyFatPercentage = m.BodyFatPercentage,
            MuscleMassPercentage = m.MuscleMassPercentage,
            Notes = m.Notes
        });

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<BodyMeasurementResponseDto>> Create([FromBody] CreateBodyMeasurementDto dto)
    {
        var patient = await _patientRepository.GetByIdAsync(dto.PatientId);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var bodyMeasurement = new BodyMeasurement(
            dto.PatientId,
            dto.MeasurementDate,
            dto.Neck,
            dto.Chest,
            dto.Waist,
            dto.Abdomen,
            dto.Hip,
            dto.RightArm,
            dto.LeftArm,
            dto.RightThigh,
            dto.LeftThigh,
            dto.RightCalf,
            dto.LeftCalf,
            dto.BodyFatPercentage,
            dto.MuscleMassPercentage,
            dto.Notes
        );

        var created = await _bodyMeasurementRepository.CreateAsync(bodyMeasurement);

        var response = new BodyMeasurementResponseDto
        {
            Id = created.Id,
            PatientId = created.PatientId,
            MeasurementDate = created.MeasurementDate,
            Neck = created.Neck,
            Chest = created.Chest,
            Waist = created.Waist,
            Abdomen = created.Abdomen,
            Hip = created.Hip,
            RightArm = created.RightArm,
            LeftArm = created.LeftArm,
            RightThigh = created.RightThigh,
            LeftThigh = created.LeftThigh,
            RightCalf = created.RightCalf,
            LeftCalf = created.LeftCalf,
            BodyFatPercentage = created.BodyFatPercentage,
            MuscleMassPercentage = created.MuscleMassPercentage,
            Notes = created.Notes
        };

        return CreatedAtAction(nameof(GetByPatient), new { patientId = created.PatientId }, response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var bodyMeasurement = await _bodyMeasurementRepository.GetByIdAsync(id);
        if (bodyMeasurement == null)
            return NotFound(new { message = "Registro não encontrado" });

        await _bodyMeasurementRepository.DeleteAsync(id);
        return NoContent();
    }
}