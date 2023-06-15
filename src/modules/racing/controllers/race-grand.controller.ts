import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RaceGrandQueries } from '../queries';
import { uniqBy } from 'lodash';

@Controller('race-grand')
export class RaceGrandController {
  constructor(private readonly raceGrandQueries: RaceGrandQueries) {}
  @Get('')
  async get(@Query('year', ParseIntPipe) year: number) {
    return await this.raceGrandQueries.find({
      where: {
        isDeleted: false,
        year,
      },
    });
  }
  @Get('years')
  async getYears() {
    return await this.raceGrandQueries.getDistinctYears();
  }
  @Get(':year/:id')
  async detail(
    @Param('year') year: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.raceGrandQueries.findOne({
      where: {
        id,
        raceResults: {
          year,
        },
      },
      relations: {
        raceResults: {
          teamDriver: {
            team: true,
          },
        },
      },
    });
    return {
      ...result,
      teams: uniqBy(
        result?.raceResults?.map((r) => r?.teamDriver?.team).filter((x) => x),
        (e) => e.id,
      ),
    };
  }
}
