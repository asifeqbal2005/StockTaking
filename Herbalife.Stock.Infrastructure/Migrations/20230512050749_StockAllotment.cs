using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StockAllotment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockAllotment",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Row = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OperatorId1 = table.Column<long>(type: "bigint", nullable: false),
                    OperatorId2 = table.Column<long>(type: "bigint", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<long>(type: "bigint", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockAllotment", x => x.ID);
                    table.ForeignKey(
                        name: "FK_StockAllotment_ClaimHandler_OperatorId2",
                        column: x => x.OperatorId2,
                        principalTable: "ClaimHandler",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockAllotment_OperatorId2",
                table: "StockAllotment",
                column: "OperatorId2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockAllotment");
        }
    }
}
