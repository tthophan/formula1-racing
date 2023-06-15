import { Controller, Get } from '@nestjs/common';
import { DriverQueries } from '../queries';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverQueries: DriverQueries) {}
  @Get('')
  async get() {
    return await this.driverQueries.find({
      where: {
        isDeleted: false,
      },
    });
  }
}
