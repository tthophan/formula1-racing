import { Module, ValidationPipe } from '@nestjs/common';
import { modules } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from './common/filters/exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const connectionConfig = configService.get<string>('DATABASE_URL');
        return {
          type: 'mysql',
          url: connectionConfig,
          autoLoadEntities: true,
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          logging: false,
          synchronize: false,
          migrationsRun: false,
          migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
          migrationsTableName: 'migrations_history',
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ...modules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          validationError: {
            target: false,
            value: false,
          },
          stopAtFirstError: true,
        }),
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
