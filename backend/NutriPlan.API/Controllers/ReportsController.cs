using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriPlan.Application.Interfaces;
using NutriPlan.Application.Services;

namespace NutriPlan.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IPatientRepository _patientRepository;
    private readonly IWeightHistoryRepository _weightHistoryRepository;
    private readonly IBodyMeasurementRepository _bodyMeasurementRepository;
    private readonly EvolutionReportService _evolutionReportService;

    public ReportsController(
        IPatientRepository patientRepository,
        IWeightHistoryRepository weightHistoryRepository,
        IBodyMeasurementRepository bodyMeasurementRepository)
    {
        _patientRepository = patientRepository;
        _weightHistoryRepository = weightHistoryRepository;
        _bodyMeasurementRepository = bodyMeasurementRepository;
        _evolutionReportService = new EvolutionReportService();
    }

    [HttpGet("evolution/{patientId}")]
    public async Task<IActionResult> GetEvolutionReport(Guid patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient == null)
            return NotFound(new { message = "Paciente não encontrado" });

        var weightHistory = (await _weightHistoryRepository.GetByPatientIdAsync(patientId)).ToList();
        var bodyMeasurements = (await _bodyMeasurementRepository.GetByPatientIdAsync(patientId)).ToList();

        var pdfBytes = _evolutionReportService.GenerateEvolutionReport(patient, weightHistory, bodyMeasurements);

        return File(pdfBytes, "application/pdf", $"relatorio-evolucao-{patient.Name}-{DateTime.Now:yyyyMMdd}.pdf");
    }
}