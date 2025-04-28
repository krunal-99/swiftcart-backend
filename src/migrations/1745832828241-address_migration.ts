import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressMigration1745832828241 implements MigrationInterface {
  name = "AddressMigration1745832828241";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "firstName" TO "first_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "lastName" TO "last_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "streetAddress" TO "street_address"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "isDefault" TO "is_default"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "first_name" TO "firstName"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "last_name" TO "lastName"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "street_address" TO "streetAddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "address" RENAME COLUMN "is_default" TO "isDefault"`
    );
  }
}
