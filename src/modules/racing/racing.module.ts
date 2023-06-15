import { Module } from '@nestjs/common';
import {
  DriverController,
  RaceGrandController,
  RaceResultController,
  TeamController,
} from './controllers';
import {
  DriverQueries,
  RaceGrandQueries,
  RaceResultQueries,
  TeamQueries,
} from './queries';

@Module({
  imports: [],
  controllers: [
    DriverController,
    RaceGrandController,
    RaceResultController,
    TeamController,
  ],
  providers: [DriverQueries, RaceGrandQueries, RaceResultQueries, TeamQueries],
})
export class RacingModule {}
