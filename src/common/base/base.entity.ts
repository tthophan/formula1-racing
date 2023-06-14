import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AuditEntity {
  @Column('id')
  @Generated()
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'createdDate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @CreateDateColumn()
  createdDate?: Date;

  @Column({ name: 'createdBy', nullable: true })
  createdBy?: string;

  @Column({
    name: 'modifiedDate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @UpdateDateColumn()
  modifiedDate?: Date;

  @Column({ name: 'modifiedBy', nullable: true })
  modifiedBy?: string;

  @Column({ name: 'isDeleted', default: false })
  isDeleted: boolean;
}
