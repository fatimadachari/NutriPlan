using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutriPlan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientHealthRestrictions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ContainsEggs",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsFish",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsGluten",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsLactose",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsNuts",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsShellfish",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContainsSoy",
                table: "Foods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "SodiumContent",
                table: "Foods",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SugarContent",
                table: "Foods",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Allergies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allergies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DietaryPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietaryPreferences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HealthConditions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConditions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PatientAllergies",
                columns: table => new
                {
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AllergyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAllergies", x => new { x.PatientId, x.AllergyId });
                    table.ForeignKey(
                        name: "FK_PatientAllergies_Allergies_AllergyId",
                        column: x => x.AllergyId,
                        principalTable: "Allergies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientAllergies_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientDietaryPreferences",
                columns: table => new
                {
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DietaryPreferenceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientDietaryPreferences", x => new { x.PatientId, x.DietaryPreferenceId });
                    table.ForeignKey(
                        name: "FK_PatientDietaryPreferences_DietaryPreferences_DietaryPreferenceId",
                        column: x => x.DietaryPreferenceId,
                        principalTable: "DietaryPreferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientDietaryPreferences_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientHealthConditions",
                columns: table => new
                {
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HealthConditionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DiagnosedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientHealthConditions", x => new { x.PatientId, x.HealthConditionId });
                    table.ForeignKey(
                        name: "FK_PatientHealthConditions_HealthConditions_HealthConditionId",
                        column: x => x.HealthConditionId,
                        principalTable: "HealthConditions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientHealthConditions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Allergies_Name",
                table: "Allergies",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DietaryPreferences_Name",
                table: "DietaryPreferences",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConditions_Name",
                table: "HealthConditions",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAllergies_AllergyId",
                table: "PatientAllergies",
                column: "AllergyId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDietaryPreferences_DietaryPreferenceId",
                table: "PatientDietaryPreferences",
                column: "DietaryPreferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientHealthConditions_HealthConditionId",
                table: "PatientHealthConditions",
                column: "HealthConditionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientAllergies");

            migrationBuilder.DropTable(
                name: "PatientDietaryPreferences");

            migrationBuilder.DropTable(
                name: "PatientHealthConditions");

            migrationBuilder.DropTable(
                name: "Allergies");

            migrationBuilder.DropTable(
                name: "DietaryPreferences");

            migrationBuilder.DropTable(
                name: "HealthConditions");

            migrationBuilder.DropColumn(
                name: "ContainsEggs",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsFish",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsGluten",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsLactose",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsNuts",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsShellfish",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "ContainsSoy",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "SodiumContent",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "SugarContent",
                table: "Foods");
        }
    }
}
