import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Import main AppModule to ensure all configs are loaded
import { SeedingService } from './seeding/seeding.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create a standalone application context
  // Pass a logger to NestFactory.createApplicationContext for more verbose output if needed
  const appContext = await NestFactory.createApplicationContext(AppModule, {
     logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Optional: more verbose logging
  });
  const logger = new Logger('Seed');


  const seeder = appContext.get(SeedingService);
  try {
    logger.log('Seeding database...');
    await seeder.seed();
    logger.log('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
    logger.error(error, error.stack);
  } finally {
    await appContext.close();
  }
}

bootstrap(); 