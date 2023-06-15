import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { BaseQueries } from "src/common/base/base.queries";
import { EntityManager } from "typeorm";
import { Driver } from "../entities";

@Injectable()
export class DriverQueries extends BaseQueries<Driver> {
  constructor(
    @InjectEntityManager()
    entityManager: EntityManager,
  ) {
    super(entityManager, Driver);
  }
}
