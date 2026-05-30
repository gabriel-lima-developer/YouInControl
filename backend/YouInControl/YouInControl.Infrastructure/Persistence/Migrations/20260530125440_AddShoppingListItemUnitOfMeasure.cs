using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YouInControl.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddShoppingListItemUnitOfMeasure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "quantity",
                table: "shopping_list_items",
                type: "numeric(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "unit_of_measure",
                table: "shopping_list_items",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "unit_of_measure",
                table: "shopping_list_items");

            migrationBuilder.Sql("""
                UPDATE shopping_list_items
                SET quantity = 1
                WHERE quantity IS NULL;
                """);

            migrationBuilder.AlterColumn<decimal>(
                name: "quantity",
                table: "shopping_list_items",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldNullable: true);
        }
    }
}
