import { merge } from 'lodash';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { Paginated, Target } from '../types';
import { AuditEntity } from './base.entity';
import { CommonRepository } from './common.repository';

export class BaseQueries<
  Entity extends AuditEntity,
> extends CommonRepository<Entity> {
  constructor(
    entityManager: EntityManager,
    target: Target<Entity>,
    type: 'mongo' | 'sql' = 'sql',
  ) {
    super(entityManager, target, type);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    if ('isDeleted' in this.properties) {
      return this.repository.find(
        merge(options, { where: { isDeleted: false } }),
      );
    }

    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<Entity>): Promise<Entity | null> | undefined {
    if ('isDeleted' in this.properties) {
      return this.repository.findOne(
        merge(options, { where: { isDeleted: false } }),
      );
    }
    return this.repository.findOne(options);
  }

  async count(options: FindManyOptions<Entity>): Promise<number> {
    return this.repository.count(options);
  }

  async findAndCount(
    options: FindManyOptions<Entity>,
  ): Promise<[Entity[], number]> {
    const condition = merge(options, {
      where: 'isDeleted' in this.properties ? { isDeleted: false } : {},
    });
    return await this.repository.findAndCount(condition);
  }

  findAndCountBy(
    options: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<[Entity[], number]> {
    if (Array.isArray(options) && 'isDeleted' in this.properties) {
      const mapOptions = options.map((x) => ({ ...x, isDeleted: false }));
      return this.repository.findAndCountBy(mapOptions);
    } else if ('isDeleted' in this.properties) {
      return this.repository.findAndCountBy(
        merge(options, { isDeleted: false }),
      );
    } else {
      return this.repository.findAndCountBy(options);
    }
  }

  async getPaginated(
    pageSize: number = 10,
    pageNumber: number = 1,
    conditions?: FindManyOptions<Entity>,
  ): Promise<Paginated<Entity>> {
    const [entities, total] = await this.findAndCount({
      ...conditions,
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
    return {
      items: entities as Array<Entity>,
      pageNumber,
      pageSize,
      totalItems: total as number,
    };
  }
}
