import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1686762465056 implements MigrationInterface {
  name = 'Generate1686762465056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`team\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NULL, \`modifiedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`modifiedBy\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`race_grand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NULL, \`modifiedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`modifiedBy\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`laps\` int NULL, \`year\` int NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`race_result\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NULL, \`modifiedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`modifiedBy\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`position\` varchar(255) NOT NULL, \`year\` int NOT NULL, \`time\` varchar(255) NOT NULL, \`points\` int NULL, \`laps\` int NULL, \`grandId\` int NOT NULL, \`teamDriverId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`team_drivers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NULL, \`modifiedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`modifiedBy\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`teamId\` int NULL, \`driverId\` int NOT NULL, \`year\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`driver\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NULL, \`modifiedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`modifiedBy\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`nationality\` varchar(255) NULL, \`shortName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`race_result\` ADD CONSTRAINT \`FK_fd71aeed1822ce9c3e486a3947a\` FOREIGN KEY (\`grandId\`) REFERENCES \`race_grand\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`race_result\` ADD CONSTRAINT \`FK_45b1da4feb148cf5b7cad147528\` FOREIGN KEY (\`teamDriverId\`) REFERENCES \`team_drivers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`team_drivers\` ADD CONSTRAINT \`FK_61cec498a6706be01f85f62f8c8\` FOREIGN KEY (\`driverId\`) REFERENCES \`driver\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`team_drivers\` ADD CONSTRAINT \`FK_5db09fb79cd1da242286dc39204\` FOREIGN KEY (\`teamId\`) REFERENCES \`team\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`team_drivers\` DROP FOREIGN KEY \`FK_5db09fb79cd1da242286dc39204\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`team_drivers\` DROP FOREIGN KEY \`FK_61cec498a6706be01f85f62f8c8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`race_result\` DROP FOREIGN KEY \`FK_45b1da4feb148cf5b7cad147528\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`race_result\` DROP FOREIGN KEY \`FK_fd71aeed1822ce9c3e486a3947a\``,
    );
    await queryRunner.query(`DROP TABLE \`driver\``);
    await queryRunner.query(`DROP TABLE \`team_drivers\``);
    await queryRunner.query(`DROP TABLE \`race_result\``);
    await queryRunner.query(`DROP TABLE \`race_grand\``);
    await queryRunner.query(`DROP TABLE \`team\``);
  }
}
