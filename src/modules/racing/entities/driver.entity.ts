import { AuditEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TeamDrivers } from './team-driver.entity';

@Entity({ name: 'driver' })
export class Driver extends AuditEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'nationality', nullable: true })
  nationality: string;

  @Column({ name: 'shortName' })
  shortName: string;

  @OneToMany(() => TeamDrivers, (teamDrivers) => teamDrivers.driver, {
    onDelete: 'CASCADE',
  })
  teamDrivers?: Array<TeamDrivers>;
}
