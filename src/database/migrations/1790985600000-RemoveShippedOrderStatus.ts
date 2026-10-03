import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveShippedOrderStatus1790985600000
  implements MigrationInterface
{
  name = 'RemoveShippedOrderStatus1790985600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "order" SET "status" = 'confirmed' WHERE "status" = 'shipped'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "CHK_order_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "CHK_order_status" CHECK ("status" IN ('pending', 'confirmed', 'delivered', 'cancelled'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "CHK_order_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "CHK_order_status" CHECK ("status" IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'))`,
    );
  }
}
