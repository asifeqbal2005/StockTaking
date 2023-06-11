using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AlterWMSInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ActualAUpdated",
                table: "WMSInventory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ActualBUpdated",
                table: "WMSInventory",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualAUpdated",
                table: "WMSInventory");

            migrationBuilder.DropColumn(
                name: "ActualBUpdated",
                table: "WMSInventory");
        }
    }
}
