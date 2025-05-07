using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComunityService.Migrations
{
    /// <inheritdoc />
    public partial class newCategoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "ServiceRequests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ServiceRequestCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRequestCategories", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_CategoryId",
                table: "ServiceRequests",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequests_ServiceRequestCategories_CategoryId",
                table: "ServiceRequests",
                column: "CategoryId",
                principalTable: "ServiceRequestCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequests_ServiceRequestCategories_CategoryId",
                table: "ServiceRequests");

            migrationBuilder.DropTable(
                name: "ServiceRequestCategories");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequests_CategoryId",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "ServiceRequests");
        }
    }
}
