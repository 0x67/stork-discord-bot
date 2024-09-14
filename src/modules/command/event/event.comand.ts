import { SlashCommandOptions } from '@/commons/decorators';
import { createEventModal } from '@/components';
import { CacheService } from '@/modules/cache';
import { EventOptionsDto } from '@/modules/command/event/dto';
import { hasAdminRoles } from '@/utils';
import { Injectable } from '@nestjs/common';
import { GuildMember } from 'discord.js';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventCommand {
  constructor(private readonly cache: CacheService) {}

  /**
   * @description Create an event
   * @usage `PREFIXevent`
   */
  @SlashCommand({ name: 'event', description: 'Create an event' })
  async onEvent(
    @Context() [interaction]: SlashCommandContext,
    @SlashCommandOptions()
    options: EventOptionsDto,
  ) {
    if (!hasAdminRoles(interaction.member as GuildMember)) {
      return await interaction.reply({
        content: 'Only admin can create event!',
        ephemeral: true,
      });
    }

    const eventId = uuid();
    await this.cache.set(
      eventId,
      Object.values(options).filter((o) => !!o),
    );

    const path = `/event/${eventId}`;
    const modal = createEventModal(path);

    return await interaction.showModal(modal);
  }
}
