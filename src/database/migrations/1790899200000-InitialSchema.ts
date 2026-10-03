import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790899200000 implements MigrationInterface {
  name = 'InitialSchema1790899200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying(320),
        "phoneNumber" character varying(32),
        "password" character varying,
        "firstName" character varying(120),
        "lastName" character varying(120),
        "profilePicture" character varying,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "tokenVersion" integer NOT NULL DEFAULT 0,
        "role" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_user" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "CHK_user_role" CHECK ("role" IN (1, 2))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_user_first_name" ON "user" ("firstName")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_last_name" ON "user" ("lastName")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_active" ON "user" ("deletedAt") WHERE "deletedAt" IS NULL`,
    );

    await queryRunner.query(`
      CREATE TABLE "otp" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "hash" character varying NOT NULL,
        "type" character varying NOT NULL,
        "attempts" integer NOT NULL DEFAULT 0,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "verifiedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_otp" PRIMARY KEY ("id"),
        CONSTRAINT "FK_otp_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_otp_attempts_nonnegative" CHECK ("attempts" >= 0),
        CONSTRAINT "CHK_otp_type" CHECK ("type" IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_otp_user_type_created" ON "otp" ("userId", "type", "createdAt" DESC)`,
    );

    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "description" text,
        "imageUrl" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_category" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_category_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "discountPercent" integer,
        "sizes" text array NOT NULL DEFAULT '{}',
        "colors" text array NOT NULL DEFAULT '{}',
        "stock" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "categoryId" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_product" PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_product_price_positive" CHECK ("price" > 0),
        CONSTRAINT "CHK_product_stock_nonnegative" CHECK ("stock" >= 0),
        CONSTRAINT "CHK_product_discount_range" CHECK ("discountPercent" IS NULL OR "discountPercent" BETWEEN 0 AND 100)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_product_name" ON "product" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_catalog" ON "product" ("categoryId", "isActive", "deletedAt")`,
    );

    await queryRunner.query(`
      CREATE TABLE "product_image" (
        "id" SERIAL NOT NULL,
        "url" character varying NOT NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "productId" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_image" PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_image_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_product_image_product_sort" ON "product_image" ("productId", "sortOrder")`,
    );

    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "clientOrderId" uuid NOT NULL,
        "totalAmount" numeric(10,2) NOT NULL,
        "status" character varying(50) NOT NULL DEFAULT 'pending',
        "shippingAddress" text NOT NULL,
        "phoneNumber" character varying(32) NOT NULL,
        "paymentMethod" character varying(50) NOT NULL DEFAULT 'cash_on_delivery',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT,
        CONSTRAINT "UQ_order_user_client_order_id" UNIQUE ("userId", "clientOrderId"),
        CONSTRAINT "CHK_order_total_nonnegative" CHECK ("totalAmount" >= 0),
        CONSTRAINT "CHK_order_status" CHECK ("status" IN ('pending', 'confirmed', 'delivered', 'cancelled')),
        CONSTRAINT "CHK_order_payment_method" CHECK ("paymentMethod" IN ('cash_on_delivery'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_user_created" ON "order" ("userId", "createdAt" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_status_created" ON "order" ("status", "createdAt" DESC)`,
    );

    await queryRunner.query(`
      CREATE TABLE "order_item" (
        "id" SERIAL NOT NULL,
        "orderId" integer NOT NULL,
        "productId" integer NOT NULL,
        "quantity" integer NOT NULL,
        "size" character varying(50) NOT NULL,
        "color" character varying(50) NOT NULL,
        "priceAtPurchase" numeric(10,2) NOT NULL,
        "discountPercentAtPurchase" integer,
        CONSTRAINT "PK_order_item" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_item_order" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_item_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_order_item_quantity_positive" CHECK ("quantity" > 0),
        CONSTRAINT "CHK_order_item_price_nonnegative" CHECK ("priceAtPurchase" >= 0),
        CONSTRAINT "CHK_order_item_discount_range" CHECK ("discountPercentAtPurchase" IS NULL OR "discountPercentAtPurchase" BETWEEN 0 AND 100)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_item_order" ON "order_item" ("orderId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_item_product" ON "order_item" ("productId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "product_image"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
