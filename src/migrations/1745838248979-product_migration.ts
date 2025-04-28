import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductMigration1745838248979 implements MigrationInterface {
  name = "ProductMigration1745838248979";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "brandId" TO "brand_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "additionalInformation" TO "additional_information"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "detailDescription" TO "detail_description"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "shortDescription" TO "short_description"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "reviewCount" TO "review_count"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "originalPrice" TO "original_price"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "salePrice" TO "sale_price"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "brand_id" TO "brandId"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "additional_information" TO "additionalInformation"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "detail_description" TO "detailDescription"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "short_description" TO "shortDescription"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "review_count" TO "reviewCount"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "original_price" TO "originalPrice"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "sale_price" TO "salePrice"`
    );
  }
}
