using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutriPlan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeightAndBodyMeasurements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BodyMeasurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MeasurementDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Neck = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    Chest = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    Waist = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    Abdomen = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    Hip = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    RightArm = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    LeftArm = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    RightThigh = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    LeftThigh = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    RightCalf = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    LeftCalf = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    BodyFatPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    MuscleMassPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BodyMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BodyMeasurements_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeightHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    BMI = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    MeasurementDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeightHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeightHistories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BodyMeasurements_PatientId_MeasurementDate",
                table: "BodyMeasurements",
                columns: new[] { "PatientId", "MeasurementDate" });

            migrationBuilder.CreateIndex(
                name: "IX_WeightHistories_PatientId_MeasurementDate",
                table: "WeightHistories",
                columns: new[] { "PatientId", "MeasurementDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BodyMeasurements");

            migrationBuilder.DropTable(
                name: "WeightHistories");
        }
    }
}
