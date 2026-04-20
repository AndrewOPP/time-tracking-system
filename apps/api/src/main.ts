import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const NODE_STATUS = process.env.NODE_ENV;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );

  app.use(cookieParser());

  if (NODE_STATUS === 'development') {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
}

bootstrap();
