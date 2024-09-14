import { GuildMember } from 'discord.js';
import { MemberOption } from 'necord';

export class BalanceInfoDto {
  @MemberOption({
    name: 'user',
    description: 'Select user',
    required: false,
  })
  user?: GuildMember;
}
