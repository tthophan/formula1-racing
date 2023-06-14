import dayjs from 'dayjs';
import { DeepPartial, EntityManager, SaveOptions } from 'typeorm';
import { Target } from '../types';
import { AuditEntity } from './base.entity';
import { CommonRepository } from './common.repository';

export class BaseRepository<
  Entity extends AuditEntity,
> extends CommonRepository<Entity> {
  constructor(
    entityManager: EntityManager,
    target: Target<Entity>,
    type: 'mongo' | 'sql' = 'sql',
  ) {
    super(entityManager, target, type);
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }

  async create(data: DeepPartial<Entity>, options?: SaveOptions) {
    const today = dayjs().unix();
    data.modifiedDate = today;
    return await this.repository.save(data, options);
  }

  async update(id: number, data: Entity) {
    return await this.repository.save({
      ...data,
      id,
    });
  }
}
