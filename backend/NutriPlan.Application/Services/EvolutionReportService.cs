using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using NutriPlan.Domain.Entities;

namespace NutriPlan.Application.Services;

public class EvolutionReportService
{
    public byte[] GenerateEvolutionReport(
        Patient patient,
        List<WeightHistory> weightHistory,
        List<BodyMeasurement> bodyMeasurements)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                page.Header().Element(container => ComposeHeader(container, patient));
                page.Content().Element(container => ComposeContent(container, patient, weightHistory, bodyMeasurements));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Página ");
                    x.CurrentPageNumber();
                    x.Span(" de ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(QuestPDF.Infrastructure.IContainer container, Patient patient)
    {
        container.Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("RELATÓRIO DE EVOLUÇÃO").FontSize(20).Bold().FontColor(Colors.Blue.Darken2);
                    col.Item().Text($"Paciente: {patient.Name}").FontSize(14).SemiBold();
                    col.Item().Text($"Gerado em: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Darken1);
                });
            });

            column.Item().PaddingVertical(10).LineHorizontal(2).LineColor(Colors.Blue.Darken2);
        });
    }

    private void ComposeContent(
        QuestPDF.Infrastructure.IContainer container,
        Patient patient,
        List<WeightHistory> weightHistory,
        List<BodyMeasurement> bodyMeasurements)
    {
        container.Column(column =>
        {
            // Informações do Paciente
            column.Item().Element(c => ComposePatientInfo(c, patient));

            // Evolução de Peso
            if (weightHistory.Any())
            {
                column.Item().PaddingTop(20).Element(c => ComposeWeightEvolution(c, weightHistory));
            }

            // Evolução de Medidas Corporais
            if (bodyMeasurements.Any())
            {
                column.Item().PaddingTop(20).Element(c => ComposeBodyMeasurementsEvolution(c, bodyMeasurements));
            }

            // Análise de Progresso
            if (weightHistory.Count >= 2 || bodyMeasurements.Count >= 2)
            {
                column.Item().PaddingTop(20).Element(c => ComposeProgressAnalysis(c, weightHistory, bodyMeasurements));
            }
        });
    }

    private void ComposePatientInfo(QuestPDF.Infrastructure.IContainer container, Patient patient)
    {
        container.Column(column =>
        {
            column.Item().Text("INFORMAÇÕES DO PACIENTE").FontSize(14).SemiBold().FontColor(Colors.Blue.Darken2);
            column.Item().PaddingTop(10);

            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Email: {patient.Email}");
                    col.Item().Text($"Idade: {patient.Age} anos");
                    col.Item().Text($"Sexo: {(patient.Gender == "M" ? "Masculino" : "Feminino")}");
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Peso Atual: {patient.Weight:F1} kg");
                    col.Item().Text($"Altura: {patient.Height:F0} cm");
                    col.Item().Text($"Objetivo: {patient.Goal}");
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"TMB: {patient.CalculateBMR():F0} kcal");
                    col.Item().Text($"TDEE: {patient.CalculateTDEE():F0} kcal");
                    if (patient.TargetWeight.HasValue)
                    {
                        col.Item().Text($"Meta de Peso: {patient.TargetWeight.Value:F1} kg");
                    }
                });
            });
        });
    }

    private void ComposeWeightEvolution(QuestPDF.Infrastructure.IContainer container, List<WeightHistory> weightHistory)
    {
        container.Column(column =>
        {
            column.Item().Text("EVOLUÇÃO DE PESO").FontSize(14).SemiBold().FontColor(Colors.Blue.Darken2);
            column.Item().PaddingTop(10);

            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(1);
                    columns.RelativeColumn(1);
                    columns.RelativeColumn(3);
                });

                // Header
                table.Header(header =>
                {
                    header.Cell().Element(CellStyle).Text("Data").SemiBold();
                    header.Cell().Element(CellStyle).Text("Peso (kg)").SemiBold();
                    header.Cell().Element(CellStyle).Text("IMC").SemiBold();
                    header.Cell().Element(CellStyle).Text("Observações").SemiBold();

                    static QuestPDF.Infrastructure.IContainer CellStyle(QuestPDF.Infrastructure.IContainer c) => c.Background(Colors.Blue.Lighten3).Padding(5);
                });

                // Dados
                foreach (var weight in weightHistory.OrderByDescending(w => w.MeasurementDate))
                {
                    table.Cell().Element(CellStyle).Text(weight.MeasurementDate.ToString("dd/MM/yyyy"));
                    table.Cell().Element(CellStyle).Text(weight.Weight.ToString("F1"));
                    table.Cell().Element(CellStyle).Text(weight.BMI.ToString("F1"));
                    table.Cell().Element(CellStyle).Text(weight.Notes ?? "-");

                    static QuestPDF.Infrastructure.IContainer CellStyle(QuestPDF.Infrastructure.IContainer c) => c.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
                }
            });
        });
    }

    private void ComposeBodyMeasurementsEvolution(QuestPDF.Infrastructure.IContainer container, List<BodyMeasurement> bodyMeasurements)
    {
        container.Column(column =>
        {
            column.Item().Text("EVOLUÇÃO DE MEDIDAS CORPORAIS").FontSize(14).SemiBold().FontColor(Colors.Blue.Darken2);
            column.Item().PaddingTop(10);

            foreach (var measurement in bodyMeasurements.OrderByDescending(m => m.MeasurementDate))
            {
                column.Item().PaddingTop(10).Column(col =>
                {
                    col.Item().Text($"Data: {measurement.MeasurementDate:dd/MM/yyyy}").SemiBold();
                    col.Item().PaddingTop(5);

                    col.Item().Row(row =>
                    {
                        if (measurement.Neck.HasValue)
                            row.RelativeItem().Text($"Pescoço: {measurement.Neck:F1} cm");
                        if (measurement.Chest.HasValue)
                            row.RelativeItem().Text($"Peitoral: {measurement.Chest:F1} cm");
                        if (measurement.Waist.HasValue)
                            row.RelativeItem().Text($"Cintura: {measurement.Waist:F1} cm");
                    });

                    col.Item().Row(row =>
                    {
                        if (measurement.Abdomen.HasValue)
                            row.RelativeItem().Text($"Abdômen: {measurement.Abdomen:F1} cm");
                        if (measurement.Hip.HasValue)
                            row.RelativeItem().Text($"Quadril: {measurement.Hip:F1} cm");
                        if (measurement.RightArm.HasValue)
                            row.RelativeItem().Text($"Braço D: {measurement.RightArm:F1} cm");
                    });

                    col.Item().Row(row =>
                    {
                        if (measurement.LeftArm.HasValue)
                            row.RelativeItem().Text($"Braço E: {measurement.LeftArm:F1} cm");
                        if (measurement.RightThigh.HasValue)
                            row.RelativeItem().Text($"Coxa D: {measurement.RightThigh:F1} cm");
                        if (measurement.LeftThigh.HasValue)
                            row.RelativeItem().Text($"Coxa E: {measurement.LeftThigh:F1} cm");
                    });

                    if (measurement.BodyFatPercentage.HasValue || measurement.MuscleMassPercentage.HasValue)
                    {
                        col.Item().PaddingTop(5).Row(row =>
                        {
                            if (measurement.BodyFatPercentage.HasValue)
                                row.RelativeItem().Text($"% Gordura: {measurement.BodyFatPercentage:F1}%");
                            if (measurement.MuscleMassPercentage.HasValue)
                                row.RelativeItem().Text($"% Músculo: {measurement.MuscleMassPercentage:F1}%");
                        });
                    }

                    if (!string.IsNullOrEmpty(measurement.Notes))
                    {
                        col.Item().PaddingTop(5).Text($"Observações: {measurement.Notes}").Italic().FontSize(9);
                    }

                    col.Item().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
                });
            }
        });
    }

    private void ComposeProgressAnalysis(
        QuestPDF.Infrastructure.IContainer container,
        List<WeightHistory> weightHistory,
        List<BodyMeasurement> bodyMeasurements)
    {
        container.Column(column =>
        {
            column.Item().Text("ANÁLISE DE PROGRESSO").FontSize(14).SemiBold().FontColor(Colors.Blue.Darken2);
            column.Item().PaddingTop(10);

            column.Item().Background(Colors.Green.Lighten4).Padding(10).Column(col =>
            {
                // Análise de Peso
                if (weightHistory.Count >= 2)
                {
                    var latest = weightHistory.OrderByDescending(w => w.MeasurementDate).First();
                    var first = weightHistory.OrderByDescending(w => w.MeasurementDate).Last();
                    var weightDiff = latest.Weight - first.Weight;
                    var days = (latest.MeasurementDate - first.MeasurementDate).Days;

                    col.Item().Text("Evolução de Peso:").SemiBold();
                    col.Item().Text($"• Peso inicial: {first.Weight:F1} kg em {first.MeasurementDate:dd/MM/yyyy}");
                    col.Item().Text($"• Peso atual: {latest.Weight:F1} kg em {latest.MeasurementDate:dd/MM/yyyy}");
                    col.Item().Text($"• Diferença: {(weightDiff > 0 ? "+" : "")}{weightDiff:F1} kg em {days} dias");

                    if (days > 0)
                    {
                        var avgPerWeek = (weightDiff / days) * 7;
                        col.Item().Text($"• Média por semana: {(avgPerWeek > 0 ? "+" : "")}{avgPerWeek:F2} kg");
                    }
                }

                // Análise de Medidas
                if (bodyMeasurements.Count >= 2)
                {
                    col.Item().PaddingTop(10).Text("Evolução de Medidas Corporais:").SemiBold();

                    var latest = bodyMeasurements.OrderByDescending(m => m.MeasurementDate).First();
                    var first = bodyMeasurements.OrderByDescending(m => m.MeasurementDate).Last();

                    if (first.Waist.HasValue && latest.Waist.HasValue)
                    {
                        var diff = latest.Waist.Value - first.Waist.Value;
                        col.Item().Text($"• Cintura: {(diff > 0 ? "+" : "")}{diff:F1} cm");
                    }

                    if (first.Hip.HasValue && latest.Hip.HasValue)
                    {
                        var diff = latest.Hip.Value - first.Hip.Value;
                        col.Item().Text($"• Quadril: {(diff > 0 ? "+" : "")}{diff:F1} cm");
                    }

                    if (first.BodyFatPercentage.HasValue && latest.BodyFatPercentage.HasValue)
                    {
                        var diff = latest.BodyFatPercentage.Value - first.BodyFatPercentage.Value;
                        col.Item().Text($"• % Gordura: {(diff > 0 ? "+" : "")}{diff:F1}%");
                    }

                    if (first.MuscleMassPercentage.HasValue && latest.MuscleMassPercentage.HasValue)
                    {
                        var diff = latest.MuscleMassPercentage.Value - first.MuscleMassPercentage.Value;
                        col.Item().Text($"• % Músculo: {(diff > 0 ? "+" : "")}{diff:F1}%");
                    }
                }
            });
        });
    }
}