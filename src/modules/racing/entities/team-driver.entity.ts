import { AuditEntity } from 'src/common/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Driver } from './driver.entity';
import { Team } from './team.entity';
import { RaceResult } from './race-result.entity';

@Entity({ name: 'team_drivers' })
export class TeamDrivers extends AuditEntity {
  @Column({ name: 'teamId', nullable: true })
  teamId: number;

  @Column({ name: 'driverId' })
  driverId: number;

  @Column({ name: 'year' })
  year: number;

  @ManyToOne(() => Driver, (driver) => driver.teamDrivers, {
    onDelete: 'CASCADE',
    cascade: true,
    persistence: false,
  })
  @JoinColumn({ name: 'driverId', referencedColumnName: 'id' })
  driver?: Driver;

  @ManyToOne(() => Team, (team) => team.teamDrivers, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team?: Team;

  @OneToMany(() => RaceResult, (raceResult) => raceResult.teamDriver, {
    onDelete: 'CASCADE',
    persistence: false,
  })
  RaceResults?: Array<RaceResult>;
}
