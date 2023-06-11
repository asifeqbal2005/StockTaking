using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Herbalife.Stock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class StockOnHandOracle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockOnHandOracle",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SNo = table.Column<long>(type: "bigint", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovibleUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sku = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lot = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Expdate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Serialkey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OnHand = table.Column<int>(type: "int", nullable: false),
                    ActualA = table.Column<int>(type: "int", nullable: false),
                    DiffA = table.Column<int>(type: "int", nullable: false),
                    ActualB = table.Column<int>(type: "int", nullable: false),
                    ActualFinal = table.Column<int>(type: "int", nullable: false),
                    DiffFinal = table.Column<int>(type: "int", nullable: false),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockOnHandOracle", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockOnHandOracle");
        }
    }
}
