import { config } from 'dotenv';
import { DataSource, SimpleConsoleLogger } from 'typeorm';
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: ['src/modules/**/*.entity.ts'],
  logging: false,
  synchronize: false,
  migrationsRun: true,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
  maxQueryExecutionTime: 100000000,
});

