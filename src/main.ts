import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api/v1/');
  app.useGlobalGuards();
  app.enableCors();
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
  // app.use(csurf())

  console.log(PORT);

  await app.listen(PORT);
}

bootstrap();
