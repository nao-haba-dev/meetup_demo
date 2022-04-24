import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cats')
export class Cat {
  @PrimaryGeneratedColumn({
    name: 'id',
    unsigned: true,
    type: 'smallint',
    comment: 'ID',
  })
  readonly id: number;

  @Column('varchar', { comment: '猫の名前' })
  name: string;

  @CreateDateColumn({ comment: '登録日時' })
  readonly ins_ts?: Timestamp;

  @UpdateDateColumn({ comment: '最終更新日時' })
  readonly upd_ts?: Timestamp;

  constructor(name: string) {
    this.name = name;
  }
}
