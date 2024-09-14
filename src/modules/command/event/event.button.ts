import { editEventModal, selectAnswerModal } from '@/components';
import { EventService, InjectEventService } from '@/modules/event';
import { hasAdminRoles } from '@/utils';
import { Injectable } from '@nestjs/common';
import { GuildMember } from 'discord.js';
import { Button, ButtonContext, ComponentParam, Context } from 'necord';

@Injectable()
export class EventButton {
  constructor(
    @InjectEventService() private readonly eventService: EventService,
  ) {}

  @Button('event/:id/edit')
  async onEdit(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('id') id: string,
  ) {
    if (!hasAdminRoles(interaction.member as GuildMember)) {
      return await interaction.reply({
        content: 'Only admin can edit polls!',
        ephemeral: false,
      });
    }

    const event = await this.eventService.findOne(id);

    if (!event) {
      return await interaction.reply({
        content: `Event with ID: \`**${id}**\` not found!`,
        ephemeral: true,
      });
    }

    const path = `/event/${id}/edit`;
    const modal = editEventModal(path);

    return await interaction.showModal(modal);
  }

  @Button('event/:id/close')
  async onClose() {
    // Handle close event
  }

  @Button('event/:id/open')
  async onOpen() {
    // Handle open event
  }

  @Button('event/:id/select-answer')
  async onSelectAnswer(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('id') id: string,
  ) {
    if (!hasAdminRoles(interaction.member as GuildMember)) {
      return await interaction.reply({
        content: 'Only admin can select answers!',
        ephemeral: false,
      });
    }

    const event = await this.eventService.findOne(id);

    if (!event) {
      return await interaction.reply({
        content: `Event with ID: \`**${id}**\` not found!`,
        ephemeral: true,
      });
    }

    const path = `/event/${id}/select-answer`;
    const modal = selectAnswerModal(path, event.options.length);

    return await interaction.showModal(modal);
  }
}
