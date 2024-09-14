import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordExceptionFilter } from '@/commons/filters';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const prisma = app.get(PrismaService);

  app.useGlobalFilters(new DiscordExceptionFilter(prisma, logger));

  await app.listen(config.get('PORT') || 3001);
}
bootstrap();
