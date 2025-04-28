import { MigrationInterface, QueryRunner } from "typeorm";

export class CartMigration1745834463879 implements MigrationInterface {
  name = "CartMigration1745834463879";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "createdAt" TO "created_at"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "updatedAt" TO "updated_at"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "created_at" TO "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "cart" RENAME COLUMN "updated_at" TO "updatedAt"`
    );
  }
}
