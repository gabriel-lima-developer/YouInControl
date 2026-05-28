using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YouInControl.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShoppingListItemPilotContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "unit",
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

            migrationBuilder.AddColumn<int>(
                name: "order",
                table: "shopping_list_items",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE shopping_list_items AS item
                SET "order" = ordered_items.row_number
                FROM (
                    SELECT
                        id,
                        ROW_NUMBER() OVER (
                            PARTITION BY shopping_list_id
                            ORDER BY created_at, id
                        ) AS row_number
                    FROM shopping_list_items
                ) AS ordered_items
                WHERE item.id = ordered_items.id;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "order",
                table: "shopping_list_items",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "order",
                table: "shopping_list_items");

            migrationBuilder.AlterColumn<decimal>(
                name: "quantity",
                table: "shopping_list_items",
                type: "numeric(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "unit",
                table: "shopping_list_items",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
