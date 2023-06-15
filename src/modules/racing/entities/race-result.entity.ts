import { AuditEntity } from 'src/common/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RaceGrand } from './race-grand.entity';
import { TeamDrivers } from './team-driver.entity';

@Entity({ name: 'race_result' })
export class RaceResult extends AuditEntity {
  @Column({ name: 'position' })
  position: string;

  @Column({ name: 'year' })
  year: number;

  @Column({ name: 'time' })
  time: string;

  @Column({ name: 'points', nullable: true })
  points: number;

  @Column({ name: 'laps', nullable: true })
  laps: number;

  @Column({ name: 'grandId' })
  grandId: number;
  @ManyToOne(() => RaceGrand, (raceGrand) => raceGrand.raceResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grandId', referencedColumnName: 'id' })
  raceGrand: RaceGrand;

  @Column({ name: 'teamDriverId' })
  teamDriverId: number;

  @ManyToOne(() => TeamDrivers, (teamDriver) => teamDriver.RaceResults, {
    onDelete: 'CASCADE',
    persistence: false,
  })
  @JoinColumn({ name: 'teamDriverId', referencedColumnName: 'id' })
  teamDriver?: TeamDrivers;
}
