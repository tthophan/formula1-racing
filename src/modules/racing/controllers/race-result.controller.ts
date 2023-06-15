import { Controller, Get, Query } from '@nestjs/common';
import { FindManyOptions, Like } from 'typeorm';
import { RaceResultQueryParam } from '../dto/race-result.dto';
import { RaceResult } from '../entities';
import { RaceResultQueries } from '../queries';
import { RaceResultTransform } from '../transformers/race-result.transform';

@Controller('race-result')
export class RaceResultController {
  constructor(private readonly raceResultQueries: RaceResultQueries) {}
  @Get('')
  async get(@Query() queryParams: RaceResultQueryParam) {
    const condition: FindManyOptions<RaceResult> = {
      where: {},
      relations: {
        raceGrand: true,
        teamDriver: {
          driver: true,
          team: true,
        },
      },
      order: {
        year: 'ASC',
        position: 'ASC',
        id: 'DESC',
      },
    };

    const {
      driverId,
      raceGrandId,
      year,
      teamId,
      position,
      pageSize,
      pageNumber,
      points,
    } = queryParams;
    if (driverId)
      condition.where = {
        ...condition.where,
        teamDriver: {
          ...condition.where['teamDriver'],
          driverId,
        },
      };
    if (raceGrandId)
      condition.where = {
        ...condition.where,
        grandId: raceGrandId,
      };

    if (teamId)
      condition.where = {
        ...condition.where,
        teamDriver: {
          ...condition.where['teamDriver'],
          teamId,
        },
      };

    if (position)
      condition.where = {
        ...condition.where,
        position: Like(`%${position}%`),
      };
    if (year)
      condition.where = {
        ...condition.where,
        raceGrand: {
          ...condition.where['raceGrand'],
          year,
        },
      };

    if (points !== null) {
      condition.where = {
        ...condition.where,
        points,
      };
    }

    const result = await this.raceResultQueries.getPaginated(
      pageSize,
      pageNumber,
      condition,
    );
    return {
      ...result,
      items: RaceResultTransform.transform(result?.items),
    };
  }
}
