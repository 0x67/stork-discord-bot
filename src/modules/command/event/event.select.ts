import { createModal, createTextInputs } from '@/components';
import { EventService, InjectEventService } from '@/modules/event';
import { handleReply, isExpired } from '@/utils';
import { Injectable } from '@nestjs/common';
import { TextInputStyle } from 'discord.js';
import {
  ComponentParam,
  Context,
  SelectedStrings,
  StringSelect,
  StringSelectContext,
} from 'necord';

@Injectable()
export class EventSelect {
  constructor(
    @InjectEventService() private readonly eventService: EventService,
  ) {}

  @StringSelect('event/:id')
  async onSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() values: string[],
    @ComponentParam('id') id: string,
  ) {
    const event = await this.eventService.findOne(id);

    if (isExpired(event.expires_at)) {
      return await handleReply(interaction, 'Event has expired!', true);
    }

    const existingVote = await this.eventService.getUserVote(
      event.id,
      interaction.user.id,
    );

    if (existingVote) {
      return await handleReply(
        interaction,
        `You already voted: \`${existingVote.option.value}\``,
        true,
      );
    }

    const totalVotes = await this.eventService.getTotalVotes(event.id);

    if (totalVotes >= event.max_participants) {
      return await handleReply(
        interaction,
        'Event has reached max votes!',
        true,
      );
    }

    const optionId = values[0];

    const inputs = createTextInputs([
      {
        customId: 'amount',
        label: 'Amount',
        placeholder: '10',
        style: TextInputStyle.Short,
        minLength: 1,
        maxLength: 10,
      },
    ]);

    const modal = createModal({
      id: `/event/${id}/vote/${optionId}`,
      title: 'Bet is final! You cannot change it later.',
      components: inputs,
    });

    return await interaction.showModal(modal);
  }
}
