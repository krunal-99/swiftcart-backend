import { MigrationInterface, QueryRunner } from "typeorm";

export class BrandMigration1745833947751 implements MigrationInterface {
  name = "BrandMigration1745833947751";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" RENAME COLUMN "categoryId" TO "category_id"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" RENAME COLUMN "category_id" TO "categoryId"`
    );
  }
}
