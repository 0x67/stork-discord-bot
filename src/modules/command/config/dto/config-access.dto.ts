import { LIST_COMMANDS } from '@/constants';
import { Role } from 'discord.js';
import { RoleOption, StringOption } from 'necord';

export class ConfigAccessDto {
  @StringOption({
    name: 'command',
    description: 'Command name',
    required: true,
    choices: LIST_COMMANDS,
  })
  command: string;

  @RoleOption({
    name: 'role',
    description: 'Role name',
    required: true,
  })
  role: Role;
}
