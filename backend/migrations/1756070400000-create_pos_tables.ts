import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePosTables1756070400000 implements MigrationInterface {
  name = 'CreatePosTables1756070400000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "category" (
      "id" SERIAL NOT NULL,
      "name" character varying(128) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMP,
      CONSTRAINT "UQ_category_name" UNIQUE ("name"),
      CONSTRAINT "PK_category_id" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`CREATE TABLE "product" (
      "id" SERIAL NOT NULL,
      "externalId" integer NOT NULL,
      "title" character varying(256) NOT NULL,
      "price" numeric(10,2) NOT NULL,
      "description" text NOT NULL,
      "imageUrl" character varying(512),
      "ratingRate" real,
      "ratingCount" integer,
      "categoryId" integer NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMP,
      CONSTRAINT "UQ_product_externalId" UNIQUE ("externalId"),
      CONSTRAINT "PK_product_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_product_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_product_externalId" ON "product" ("externalId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_category_name" ON "category" ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_externalId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_category_name"`);
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_product_category"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
