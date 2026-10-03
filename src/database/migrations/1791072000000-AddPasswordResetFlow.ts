import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetFlow1791072000000 implements MigrationInterface {
  name = 'AddPasswordResetFlow1791072000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "tokenVersion" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "verifiedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "CHK_otp_type"`);
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "CHK_otp_type" CHECK ("type" IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "otp" WHERE "type" = 'PASSWORD_RESET'`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "CHK_otp_type"`);
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "CHK_otp_type" CHECK ("type" IN ('EMAIL_VERIFICATION'))`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "verifiedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenVersion"`);
  }
}
