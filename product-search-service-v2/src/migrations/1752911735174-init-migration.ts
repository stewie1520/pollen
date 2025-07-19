import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1752911735174 implements MigrationInterface {
  name = 'InitMigration1752911735174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, CONSTRAINT "PK_4282276c4dca935df458b31bd04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_company_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_490f7cfd9b5984a91987582c542" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1691faa100987f51850c481c79b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batch_model_pkgtype_enum" AS ENUM('CARTON', 'PALLET')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batch_model_currencycode_enum" AS ENUM('USD', 'SGD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batch_model_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "batch_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batchNo" character varying NOT NULL, "batchImageId" character varying NOT NULL, "listing_variant_id" uuid NOT NULL, "pkgQty" integer NOT NULL, "pkgType" "public"."batch_model_pkgtype_enum" NOT NULL, "retailPricePerPkg" numeric(10,2) NOT NULL, "unitPerPkg" integer NOT NULL, "currencyCode" "public"."batch_model_currencycode_enum" NOT NULL, "retailPricePerUnit" numeric(10,2) NOT NULL, "listPricePerPkg" numeric(10,2) NOT NULL, "listPricePerUnit" numeric(10,2) NOT NULL, "batchDiscount" numeric(5,2) NOT NULL, "expiryDate" date NOT NULL, "status" "public"."batch_model_status_enum" NOT NULL, "warehouse_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, CONSTRAINT "UQ_241b90e1c85762944d69f56ece3" UNIQUE ("batchNo"), CONSTRAINT "PK_6b1b314f70ee21a7f66dd94038a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "warehouse_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d799af1123f362089e173964f4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."listing_channel_model_saleschannel_enum" AS ENUM('MARKETPLACE', 'PHYSICAL_STORE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "listing_channel_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "salesChannel" "public"."listing_channel_model_saleschannel_enum" NOT NULL, "lms_company_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, CONSTRAINT "PK_357676844ae110888b801f04405" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_listing_channel_name" ON "listing_channel_model" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "listing_variant_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "variantName" character varying NOT NULL, "imageId" character varying NOT NULL, "listing_id" uuid NOT NULL, "listing_channel_id" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_486d423f8e4d0dd4534bb2f5e42" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_listing_variant_name" ON "listing_variant_model" ("variantName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_listing_variant_sku" ON "listing_variant_model" ("sku") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."listing_model_status_enum" AS ENUM('ACTIVE', 'DRAFT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "listing_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listingNo" character varying NOT NULL, "status" "public"."listing_model_status_enum" NOT NULL, "sub_category_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_788a58bfed686149230d16ab6f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_7a424f07f46010d3441442f7764" FOREIGN KEY ("category_id") REFERENCES "category_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_model" ADD CONSTRAINT "FK_c40dbf5d28415294a7f3f4a94e0" FOREIGN KEY ("listing_variant_id") REFERENCES "listing_variant_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_model" ADD CONSTRAINT "FK_f3dfff970f27f1598778269d17d" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "warehouse_model" ADD CONSTRAINT "FK_fb09b3af29fc5b80c72d995730d" FOREIGN KEY ("country_id") REFERENCES "country_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_channel_model" ADD CONSTRAINT "FK_752f1391055017181c40ff9f5c0" FOREIGN KEY ("lms_company_id") REFERENCES "lms_company_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_variant_model" ADD CONSTRAINT "FK_97f6c096d40ec594d6c5bf7ed5a" FOREIGN KEY ("listing_id") REFERENCES "listing_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_variant_model" ADD CONSTRAINT "FK_8c76ddbfe58374881fa5a9830cf" FOREIGN KEY ("listing_channel_id") REFERENCES "listing_channel_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_model" ADD CONSTRAINT "FK_2a599cf905bf6171eedfaef2936" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_model" DROP CONSTRAINT "FK_2a599cf905bf6171eedfaef2936"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_variant_model" DROP CONSTRAINT "FK_8c76ddbfe58374881fa5a9830cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_variant_model" DROP CONSTRAINT "FK_97f6c096d40ec594d6c5bf7ed5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_channel_model" DROP CONSTRAINT "FK_752f1391055017181c40ff9f5c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "warehouse_model" DROP CONSTRAINT "FK_fb09b3af29fc5b80c72d995730d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_model" DROP CONSTRAINT "FK_f3dfff970f27f1598778269d17d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_model" DROP CONSTRAINT "FK_c40dbf5d28415294a7f3f4a94e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_7a424f07f46010d3441442f7764"`,
    );
    await queryRunner.query(`DROP TABLE "listing_model"`);
    await queryRunner.query(`DROP TYPE "public"."listing_model_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_listing_variant_sku"`);
    await queryRunner.query(`DROP INDEX "public"."idx_listing_variant_name"`);
    await queryRunner.query(`DROP TABLE "listing_variant_model"`);
    await queryRunner.query(`DROP INDEX "public"."idx_listing_channel_name"`);
    await queryRunner.query(`DROP TABLE "listing_channel_model"`);
    await queryRunner.query(
      `DROP TYPE "public"."listing_channel_model_saleschannel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "warehouse_model"`);
    await queryRunner.query(`DROP TABLE "batch_model"`);
    await queryRunner.query(`DROP TYPE "public"."batch_model_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."batch_model_currencycode_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."batch_model_pkgtype_enum"`);
    await queryRunner.query(`DROP TABLE "country_model"`);
    await queryRunner.query(`DROP TABLE "lms_company_model"`);
    await queryRunner.query(`DROP TABLE "sub_categories"`);
    await queryRunner.query(`DROP TABLE "category_model"`);
  }
}
