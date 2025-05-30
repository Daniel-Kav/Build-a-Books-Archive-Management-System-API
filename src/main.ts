import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip away any properties not defined in the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Convert string path/query params to expected types
    },
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const host = '0.0.0.0'
  await app.listen(process.env.PORT ?? 3000, host);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
