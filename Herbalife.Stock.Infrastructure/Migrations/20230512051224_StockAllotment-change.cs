using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StockAllotmentchange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockAllotment_ClaimHandler_OperatorId2",
                table: "StockAllotment");

            migrationBuilder.DropIndex(
                name: "IX_StockAllotment_OperatorId2",
                table: "StockAllotment");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_StockAllotment_OperatorId2",
                table: "StockAllotment",
                column: "OperatorId2");

            migrationBuilder.AddForeignKey(
                name: "FK_StockAllotment_ClaimHandler_OperatorId2",
                table: "StockAllotment",
                column: "OperatorId2",
                principalTable: "ClaimHandler",
                principalColumn: "ID");
        }
    }
}
