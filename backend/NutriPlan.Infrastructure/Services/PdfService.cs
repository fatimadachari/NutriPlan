using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using NutriPlan.Application.Interfaces;

namespace NutriPlan.Infrastructure.Services;

public class PdfService : IPdfService
{
    private readonly IDietRepository _dietRepository;
    private readonly IPatientRepository _patientRepository;

    public PdfService(IDietRepository dietRepository, IPatientRepository patientRepository)
    {
        _dietRepository = dietRepository;
        _patientRepository = patientRepository;
    }

    public async Task<byte[]> GenerateDietPdfAsync(Guid dietId)
    {
        var diet = await _dietRepository.GetByIdAsync(dietId);
        if (diet == null)
            throw new Exception("Dieta não encontrada");

        var patient = await _patientRepository.GetByIdAsync(diet.PatientId);
        if (patient == null)
            throw new Exception("Paciente não encontrado");

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                page.Header().Element(c => ComposeHeader(c, patient));
                page.Content().Element(c => ComposeContent(c, diet, patient));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container, Domain.Entities.Patient patient)
    {
        container.Column(column =>
        {
            // Logo/Título
            column.Item().Background(Colors.Green.Lighten3).Padding(15).Text("NutriPlan")
                .FontSize(24)
                .Bold()
                .FontColor(Colors.White);

            column.Item().PaddingVertical(10);

            // Informações do Paciente
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Paciente: {patient.Name}").FontSize(13).Bold();
                    col.Item().Text($"Email: {patient.Email}").FontSize(10);
                    col.Item().Text($"Idade: {patient.Age} anos").FontSize(10);
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Peso: {patient.Weight} kg").FontSize(10);
                    col.Item().Text($"Altura: {patient.Height} cm").FontSize(10);
                    col.Item().Text($"Objetivo: {patient.Goal}").FontSize(10).Bold();
                });
            });

            column.Item().PaddingVertical(5);
            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
        });
    }

    private void ComposeContent(IContainer container, Domain.Entities.Diet diet, Domain.Entities.Patient patient)
    {
        container.Column(column =>
        {
            // Resumo Nutricional
            column.Item().PaddingTop(10).Background(Colors.Blue.Lighten4).Padding(10).Row(row =>
            {
                row.RelativeItem().Text($"Total Diário: {diet.TotalCalories:F1} kcal").FontSize(12).Bold();
                row.RelativeItem().Text($"Proteínas: {diet.TotalProtein:F1}g").FontSize(11);
                row.RelativeItem().Text($"Carboidratos: {diet.TotalCarbs:F1}g").FontSize(11);
                row.RelativeItem().Text($"Gorduras: {diet.TotalFat:F1}g").FontSize(11);
            });

            column.Item().PaddingVertical(10);

            // Refeições
            foreach (var meal in diet.Meals.OrderBy(m => m.Order))
            {
                column.Item().PaddingVertical(5);

                // Cabeçalho da Refeição
                column.Item().Background(Colors.Green.Lighten4).Padding(8).Row(row =>
                {
                    row.RelativeItem().Text(meal.Name).FontSize(13).Bold();
                    row.ConstantItem(200).Text($"{meal.TotalCalories:F1} kcal | P: {meal.TotalProtein:F1}g | C: {meal.TotalCarbs:F1}g | G: {meal.TotalFat:F1}g")
                        .FontSize(10);
                });

                // Tabela de Alimentos
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);  // Alimento
                        columns.RelativeColumn(1);  // Quantidade
                        columns.RelativeColumn(1);  // Calorias
                        columns.RelativeColumn(1);  // Proteínas
                        columns.RelativeColumn(1);  // Carboidratos
                        columns.RelativeColumn(1);  // Gorduras
                    });

                    // Cabeçalho da Tabela
                    table.Header(header =>
                    {
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Alimento").FontSize(9).Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Qtd (g)").FontSize(9).Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Kcal").FontSize(9).Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Prot (g)").FontSize(9).Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Carb (g)").FontSize(9).Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Gord (g)").FontSize(9).Bold();
                    });

                    // Linhas da Tabela
                    foreach (var mealFood in meal.MealFoods)
                    {
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(mealFood.Food?.Name ?? "").FontSize(9);
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{mealFood.Quantity}").FontSize(9);
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{mealFood.CalculatedCalories:F1}").FontSize(9);
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{mealFood.CalculatedProtein:F1}").FontSize(9);
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{mealFood.CalculatedCarbs:F1}").FontSize(9);
                        table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{mealFood.CalculatedFat:F1}").FontSize(9);
                    }
                });

                column.Item().PaddingVertical(3);
            }

            // Observações
            column.Item().PaddingTop(15).PaddingBottom(10).Text("Observações:")
                .FontSize(11).Bold();

            column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).MinHeight(60)
                .Text("Siga a dieta conforme orientação. Beba bastante água durante o dia (mínimo 2 litros). Em caso de dúvidas, entre em contato com seu nutricionista.")
                .FontSize(9)
                .Italic();
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(text =>
        {
            text.Span("Gerado por ").FontSize(9);
            text.Span("NutriPlan").FontSize(9).Bold().FontColor(Colors.Green.Medium);
            text.Span($" em {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
        });
    }
}