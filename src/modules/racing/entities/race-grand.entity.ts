import { AuditEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RaceResult } from './race-result.entity';

@Entity({ name: 'race_grand' })
export class RaceGrand extends AuditEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'laps', nullable: true })
  laps: number;

  @Column({ name: 'year' })
  year: number;

  @Column({ name: 'url' })
  url: string;

  @OneToMany(() => RaceResult, (raceResult) => raceResult.raceGrand, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  raceResults?: Array<RaceResult>;
}
