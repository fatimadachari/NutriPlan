using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutriPlan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnamneseTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Anamneses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MainComplaint = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ConsultationGoal = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Expectations = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FamilyHistory = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PreExistingDiseases = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PreviousSurgeries = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CurrentMedications = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Supplements = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MedicationAllergies = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MealsPerDay = table.Column<int>(type: "int", nullable: false),
                    MealTimes = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    FoodPreferences = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DislikedFoods = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FoodIntolerances = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WaterIntakeLiters = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    AlcoholConsumption = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FastFoodFrequency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SleepHoursPerDay = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    StressLevel = table.Column<int>(type: "int", nullable: false),
                    PhysicalActivity = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    WorkRoutine = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsSmoker = table.Column<bool>(type: "bit", nullable: false),
                    PreviousDiets = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    AdditionalObservations = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ExamFiles = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anamneses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Anamneses_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Anamneses_PatientId",
                table: "Anamneses",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Anamneses");
        }
    }
}
