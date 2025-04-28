import { MigrationInterface, QueryRunner } from "typeorm";

export class CartItemMigration1745834736535 implements MigrationInterface {
  name = "CartItemMigration1745834736535";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" RENAME COLUMN "selectedColor" TO "selected_color"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" RENAME COLUMN "addedAt" TO "added_at"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" RENAME COLUMN "selected_color" TO "selectedColor"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" RENAME COLUMN "added_at" TO "addedAt"`
    );
  }
}
