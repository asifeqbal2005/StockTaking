using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StockOnHandOracle1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CreatedBy",
                table: "StockOnHandOracle",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "StockOnHandOracle",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UpdatedBy",
                table: "StockOnHandOracle",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "StockOnHandOracle",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StockOnHandOracle");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "StockOnHandOracle");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "StockOnHandOracle");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "StockOnHandOracle");
        }
    }
}
