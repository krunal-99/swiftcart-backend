import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderMigration1745835421666 implements MigrationInterface {
  name = "OrderMigration1745835421666";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "shippingAddress" TO "shipping_address"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "estimatedDelivery" TO "estimated_delivery"`
    );

    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "paymentStatus" TO "payment_status"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "paymentEmail" TO "payment_email"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "paymentMethod" TO "payment_method"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "shipping_address" TO "shippingAddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "estimated_delivery" TO "estimatedDelivery"`
    );

    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "payment_status" TO "paymentStatus"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "payment_email" TO "paymentEmail"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "payment_method" TO "paymentMethod"`
    );
  }
}
