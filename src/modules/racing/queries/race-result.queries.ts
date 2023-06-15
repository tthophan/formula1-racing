import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseQueries } from 'src/common/base/base.queries';
import { EntityManager } from 'typeorm';
import { RaceResult } from '../entities';

@Injectable()
export class RaceResultQueries extends BaseQueries<RaceResult> {
  constructor(
    @InjectEntityManager()
    entityManager: EntityManager,
  ) {
    super(entityManager, RaceResult);
  }
}
