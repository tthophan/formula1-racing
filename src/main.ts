import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080

  app.setGlobalPrefix('api/v1');
  await app.listen(port, async () => {
    console.log(`Application listen on ${await app.getUrl()}`);
  });
}
bootstrap();
