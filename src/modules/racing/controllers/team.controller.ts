import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeamQueries } from '../queries';
import { uniqBy } from 'lodash';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamQueries: TeamQueries) {}
  @Get('')
  async get() {
    return await this.teamQueries.find({
      where: {
        isDeleted: false,
      },
    });
  }
  @Get(':raceGrandId/:year/:id')
  async detail(
    @Param('raceGrandId', ParseIntPipe) raceGrandId: number,
    @Param('year', ParseIntPipe) year: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const rs = await this.teamQueries.findOne({
      where: {
        id,
        teamDrivers: {
          year,
          RaceResults: {
            grandId: raceGrandId,
          },
        },
      },
      relations: {
        teamDrivers: {
          driver: true,
        },
      },
    });
    console.log(rs?.teamDrivers);
    return {
      ...rs,
      drivers: uniqBy(
        rs?.teamDrivers?.map((td) => td.driver),
        (e) => e.id,
      ),
    };
  }
}
