import { AuditEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TeamDrivers } from './team-driver.entity';

@Entity({ name: 'team' })
export class Team extends AuditEntity {
  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => TeamDrivers, (teamDrivers) => teamDrivers.team, {
    onDelete: 'CASCADE',
  })
  teamDrivers: Array<TeamDrivers>;
}
