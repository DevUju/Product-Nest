import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import 'reflect-metadata';
import { CategoryService } from './categories/categories.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  const categoryService = app.get(CategoryService);
  await categoryService.seed();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://dainty-rugelach-404c9c.netlify.app/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
