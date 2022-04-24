import { MigrationInterface, QueryRunner } from 'typeorm';

export class cats1650814095673 implements MigrationInterface {
  name = 'cats1650814095673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cats\` (\`id\` smallint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID', \`name\` varchar(255) NOT NULL COMMENT '猫の名前', \`ins_ts\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`upd_ts\` datetime(6) NOT NULL COMMENT '最終更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`cats\``);
  }
}
