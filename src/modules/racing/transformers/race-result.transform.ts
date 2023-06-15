import { isArray } from 'class-validator';
import { RaceResult } from '../entities';
import { RaceResultResponse } from '../interfaces';

export class RaceResultTransform {
  static transform(
    input: RaceResult | Array<RaceResult>,
  ): RaceResultResponse | Array<RaceResultResponse> {
    const mapping = (input: RaceResult) => ({
      driverName: input?.teamDriver?.driver?.name,
      driverNationality: input?.teamDriver?.driver?.nationality,
      laps: input.raceGrand?.laps,
      points: input.points,
      position: input.position,
      raceGrandName: input.raceGrand?.name,
      teamName: input.teamDriver?.team?.name,
      year: input.raceGrand?.year,
      time: input.time
    });
    if (isArray(input)) {
      return input.map(mapping);
    }
    return mapping(input);
  }
}
