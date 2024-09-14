import { hostname } from 'os';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { LoggerModule } from 'nestjs-pino';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { loggerConfig } from '@/configs';
import { PrismaModule, PrismaService } from '@/modules/prisma';
import { CacheModule } from '@/modules/cache';
import { TransactionModule } from '@/modules/transaction';
import { EventModule } from '@/modules/event';
import { SchedulerModule } from '@/modules/scheduler';
import { CommandModule } from '@/modules/command';
import { PGBossModule } from '@apricote/nest-pg-boss';
import { parsePostgresConnectionString } from '@/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(loggerConfig),
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('BOT_TOKEN'),
        intents: [
          IntentsBitField.Flags.GuildPresences,
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.MessageContent,
          IntentsBitField.Flags.GuildMessages,
        ],
        development:
          config.get('NODE_ENV') === 'dev'
            ? ['1255367421762474129']
            : undefined,
      }),
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    PGBossModule.forRootAsync({
      inject: [ConfigService],
      application_name: `Stork Discord Bot (${hostname()})`,
      useFactory: (configService: ConfigService) => {
        const config = configService.get('DATABASE_URL');

        const { host, username, password, port, database } =
          parsePostgresConnectionString(config);

        return {
          application_name: `ShopNJoy API (${hostname()})`,
          schema: 'scheduler',
          host,
          password,
          user: username,
          port,
          database,
        };
      },
    }),
    PrismaModule,
    CacheModule,
    TransactionModule,
    EventModule,
    SchedulerModule,
    CommandModule,
  ],
})
export class AppModule {}
