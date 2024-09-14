import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';
import { EventModule } from './event/event.module';
// import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    BalanceModule,
    EventModule,
    // ConfigModule
  ],
})
export class CommandModule {}
