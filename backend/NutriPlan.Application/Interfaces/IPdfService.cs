namespace NutriPlan.Application.Interfaces;

public interface IPdfService
{
    Task<byte[]> GenerateDietPdfAsync(Guid dietId);
}