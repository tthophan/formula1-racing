import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseQueries } from 'src/common/base/base.queries';
import { EntityManager } from 'typeorm';
import { RaceGrand } from '../entities';

@Injectable()
export class RaceGrandQueries extends BaseQueries<RaceGrand> {
  constructor(
    @InjectEntityManager()
    entityManager: EntityManager,
  ) {
    super(entityManager, RaceGrand);
  }
  async getDistinctYears() {
    return await this.repository
      .createQueryBuilder()
      .select('DISTINCT year')
      .orderBy('year', 'DESC')
      .getRawMany();
  }
}
