import {
  EntityManager,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { AuditEntity } from './base.entity';
import { Target } from '../types';

export class CommonRepository<Entity extends AuditEntity> {
  protected properties: ObjectLiteral;
  protected repository: Repository<Entity>;
  protected constructor(
    entityManager: EntityManager,
    protected target: Target<Entity>,
    type: 'mongo' | 'sql',
  ) {
    this.repository =
      type === 'sql'
        ? entityManager.getRepository(target)
        : entityManager.getMongoRepository(target);
    this.properties = this.repository.metadata.propertiesMap;
  }

  withManager(manager: EntityManager): this {
    const thisRepo = this.constructor as new (...args: any[]) => typeof this;
    const { target } = this;
    const cls = new (class extends thisRepo {})(manager, target);
    return cls as typeof this;
  }

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
}
