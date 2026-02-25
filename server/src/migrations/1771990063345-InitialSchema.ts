import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1771990063345 implements MigrationInterface {
    name = 'InitialSchema1771990063345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "displayName" character varying NOT NULL, "avatarUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."friendship_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED')`);
        await queryRunner.query(`CREATE TABLE "friendship" ("id" uuid NOT NULL, "requesterId" uuid NOT NULL, "addresseeId" uuid NOT NULL, "status" "public"."friendship_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48a37dcc1431c47e2d92b2f404a" UNIQUE ("requesterId", "addresseeId"), CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."gift_list_visibility_enum" AS ENUM('PRIVATE', 'FRIENDS')`);
        await queryRunner.query(`CREATE TABLE "gift_list" ("id" uuid NOT NULL, "ownerId" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying, "visibility" "public"."gift_list_visibility_enum" NOT NULL DEFAULT 'PRIVATE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de40a3605fa61522aa7a49f470a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."list_invite_status_enum" AS ENUM('PENDING', 'ACCEPTED')`);
        await queryRunner.query(`CREATE TABLE "list_invite" ("id" uuid NOT NULL, "listId" uuid NOT NULL, "inviteeEmail" character varying NOT NULL, "inviteeId" uuid, "status" "public"."list_invite_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c172d3b6e4b3b84c718c4d6447" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gift_item" ("id" uuid NOT NULL, "listId" uuid NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "description" text, "price" character varying, "imageUrl" text, "priority" integer NOT NULL DEFAULT '1', "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0449b354160199275b2121762c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gift_claim" ("id" uuid NOT NULL, "itemId" uuid NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "claimedById" uuid, CONSTRAINT "REL_d77a38d9b8c7a218d7772527b4" UNIQUE ("itemId"), CONSTRAINT "PK_d89c036c923e664c0b1d1d7440f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_b29f15b88ee36453605ade63cb2" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8012340b570c83b55e0d3ef829a" FOREIGN KEY ("addresseeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift_list" ADD CONSTRAINT "FK_77591c96b72fb263cf84c3d5875" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_invite" ADD CONSTRAINT "FK_068d255a0ba045fd4ba67bcb9bf" FOREIGN KEY ("listId") REFERENCES "gift_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_invite" ADD CONSTRAINT "FK_4b1d07f5babb658a1602d10a796" FOREIGN KEY ("inviteeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift_item" ADD CONSTRAINT "FK_17f0391db644d5a1e015cdfcb35" FOREIGN KEY ("listId") REFERENCES "gift_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift_claim" ADD CONSTRAINT "FK_d77a38d9b8c7a218d7772527b42" FOREIGN KEY ("itemId") REFERENCES "gift_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gift_claim" ADD CONSTRAINT "FK_faffc70566a03a1a809bb57578d" FOREIGN KEY ("claimedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gift_claim" DROP CONSTRAINT "FK_faffc70566a03a1a809bb57578d"`);
        await queryRunner.query(`ALTER TABLE "gift_claim" DROP CONSTRAINT "FK_d77a38d9b8c7a218d7772527b42"`);
        await queryRunner.query(`ALTER TABLE "gift_item" DROP CONSTRAINT "FK_17f0391db644d5a1e015cdfcb35"`);
        await queryRunner.query(`ALTER TABLE "list_invite" DROP CONSTRAINT "FK_4b1d07f5babb658a1602d10a796"`);
        await queryRunner.query(`ALTER TABLE "list_invite" DROP CONSTRAINT "FK_068d255a0ba045fd4ba67bcb9bf"`);
        await queryRunner.query(`ALTER TABLE "gift_list" DROP CONSTRAINT "FK_77591c96b72fb263cf84c3d5875"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8012340b570c83b55e0d3ef829a"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_b29f15b88ee36453605ade63cb2"`);
        await queryRunner.query(`DROP TABLE "gift_claim"`);
        await queryRunner.query(`DROP TABLE "gift_item"`);
        await queryRunner.query(`DROP TABLE "list_invite"`);
        await queryRunner.query(`DROP TYPE "public"."list_invite_status_enum"`);
        await queryRunner.query(`DROP TABLE "gift_list"`);
        await queryRunner.query(`DROP TYPE "public"."gift_list_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
        await queryRunner.query(`DROP TYPE "public"."friendship_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
