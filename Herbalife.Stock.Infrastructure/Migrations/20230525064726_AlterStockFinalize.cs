using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AlterStockFinalize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsManagerFinalize",
                table: "StockAllotment",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsManagerFinalize",
                table: "StockAllotment");
        }
    }
}
