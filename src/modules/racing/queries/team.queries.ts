import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseQueries } from 'src/common/base/base.queries';
import { EntityManager } from 'typeorm';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamQueries extends BaseQueries<Team> {
  constructor(
    @InjectEntityManager()
    entityManager: EntityManager,
  ) {
    super(entityManager, Team);
  }
}
