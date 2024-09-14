import { ConfigCommandDecorator } from '@/modules/command/config/config-command.decorator';
import { ConfigAccessDto } from '@/modules/command/config/dto/config-access.dto';
import { Context, Options, SlashCommandContext, Subcommand } from 'necord';

@ConfigCommandDecorator()
export class ConfigAccessCommand {
  constructor() {}

  @Subcommand({
    name: 'access',
    description: 'Change access settings for the bot',
  })
  async updateAccess(
    @Context() [interaction]: SlashCommandContext,
    @Options() dto: ConfigAccessDto,
  ) {
    console.log(dto);
    return interaction.reply('Not implemented yet');
  }
}
