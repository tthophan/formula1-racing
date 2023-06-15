import { config } from 'dotenv';
import { DataSource, SimpleConsoleLogger } from 'typeorm';
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host:process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  entities: ['src/modules/**/*.entity.ts'],
  logging: false,
  synchronize: false,
  migrationsRun: true,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
  maxQueryExecutionTime: 100000000,
});

