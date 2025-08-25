import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTables1756070600000 implements MigrationInterface {
  name = 'CreateOrderTables1756070600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "order" (
      "id" SERIAL NOT NULL,
      "status" character varying(16) NOT NULL DEFAULT 'PENDING',
      "total" numeric(10,2) NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMP,
      CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`CREATE TABLE "order_item" (
      "id" SERIAL NOT NULL,
      "orderId" integer NOT NULL,
      "productId" integer,
      "productName" character varying(256) NOT NULL,
      "productPrice" numeric(10,2) NOT NULL,
      "quantity" integer NOT NULL,
      "lineTotal" numeric(10,2) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMP,
      CONSTRAINT "PK_order_item_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_orderitem_order" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT "FK_orderitem_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    )`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_order_status" ON "order" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_order_createdAt" ON "order" ("createdAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_status"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_orderitem_product"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_orderitem_order"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
