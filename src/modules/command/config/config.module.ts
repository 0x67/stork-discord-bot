import { ConfigAccessCommand } from '@/modules/command/config/sub-commands/config-access.command';
import { ConfigCurrencyCommand } from '@/modules/command/config/sub-commands/config-currency.command';
import { Module } from '@nestjs/common';

@Module({
  providers: [ConfigCurrencyCommand, ConfigAccessCommand],
})
export class ConfigModule {}
