import { ConfigCommandDecorator } from '@/modules/command/config/config-command.decorator';
import { ConfigCurrencyDto } from '@/modules/command/config/dto';
import { Context, Options, SlashCommandContext, Subcommand } from 'necord';

@ConfigCommandDecorator()
export class ConfigCurrencyCommand {
  constructor() {}

  @Subcommand({
    name: 'currency',
    description: 'Change default currency name and symbol',
  })
  async updateCurrency(
    @Context() [interaction]: SlashCommandContext,
    @Options() dto: ConfigCurrencyDto,
  ) {
    // TODO: Update config in DB
  }
}
