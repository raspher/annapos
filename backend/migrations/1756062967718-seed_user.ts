import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcryptjs";

export class SeedUser1756062967718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = await bcrypt.hash("changeme", 10);

        await queryRunner.query(
            `INSERT INTO "user" ("name", "email", "password", "createdAt", "updatedAt") VALUES ($1, $2, $3, now(), now())`,
            ["admin", "admin@admin.pl", password]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE email = $1`, ["admin@admin.pl"]);
    }

}
