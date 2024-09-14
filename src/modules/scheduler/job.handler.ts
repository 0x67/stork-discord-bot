import { JobService } from '@apricote/nest-pg-boss';
import {
  CloseEventJob,
  CloseEventJobData,
  DistributeEventRewardsJob,
  DistributeEventRewardsJobData,
} from '@/modules/scheduler/jobs';
import { Injectable } from '@nestjs/common';
import { EventService, InjectEventService } from '@/modules/event';
import { Job } from 'pg-boss';
import { Client, StringSelectMenuComponent, TextChannel } from 'discord.js';
import {
  createButtonRows,
  createEventEmbed,
  createSelectMenu,
  EventEditButton,
  EventSelectAnswerButton,
  EventStatus,
} from '@/components';
import { TransactionType } from '@prisma/client';
import {
  InjectTransactionService,
  TransactionService,
} from '@/modules/transaction';
import { numberToEmoji } from '@/utils';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class JobHandler {
  constructor(
    private readonly discordClient: Client,
    @CloseEventJob.Inject()
    private readonly closeEventJob: JobService<CloseEventJobData>,
    @DistributeEventRewardsJob.Inject()
    private readonly distributeEventRewardsJob: JobService<DistributeEventRewardsJobData>,
    @InjectEventService()
    private readonly eventService: EventService,
    @InjectTransactionService()
    private readonly transactionService: TransactionService,
  ) {}

  @CloseEventJob.Handle()
  private async handleCloseEventJob(data: Job<CloseEventJobData>) {
    const { id } = data.data;
    const event = await this.eventService.findOne(id, true);

    if (!event || event.closed) return;

    const channel = (await this.discordClient.channels.fetch(
      event.channel_id,
    )) as TextChannel;

    if (!channel.isTextBased() || !channel) return;

    const discordMessage = await channel.messages.fetch(event.message_id);

    if (!discordMessage) return;

    const [
      {
        components: [oldSelectMenuRows],
      },
    ] = discordMessage.components as unknown as [
      { components: [StringSelectMenuComponent] },
    ];

    const updatedSelectMenuRows = createSelectMenu({
      customId: oldSelectMenuRows.data.custom_id,
      placeholder: oldSelectMenuRows.data.placeholder,
      options: oldSelectMenuRows.data.options,
      disabled: true,
    });

    const buttonRows = createButtonRows([
      new EventEditButton(id).setDisabled(true),
      new EventSelectAnswerButton(id),
    ]);

    // Update the message with the new select menu and buttons
    // as well as new embeds
    const embeds = createEventEmbed({
      id,
      question: event.question,
      max_participants: event.max_participants,
      event,
      expires_at: event.expires_at,
      status: EventStatus.Waiting,
    });

    await discordMessage.edit({
      embeds,
      components: [updatedSelectMenuRows, buttonRows],
    });
  }

  @DistributeEventRewardsJob.Handle()
  @Transactional()
  private async handleDistributeEventRewardsJob(
    data: Job<DistributeEventRewardsJobData>,
  ) {
    const { id } = data.data;
    const event = await this.eventService.findOne(id, true);

    if (!event || event.closed) return;

    const channel = (await this.discordClient.channels.fetch(
      event.channel_id,
    )) as TextChannel;

    if (!channel.isTextBased() || !channel) return;

    const discordMessage = await channel.messages.fetch(event.message_id);

    if (!discordMessage) return;

    const [
      {
        components: [oldSelectMenuRows],
      },
    ] = discordMessage.components as unknown as [
      { components: [StringSelectMenuComponent] },
    ];

    const updatedSelectMenuRows = createSelectMenu({
      customId: oldSelectMenuRows.data.custom_id,
      placeholder: oldSelectMenuRows.data.placeholder,
      options: oldSelectMenuRows.data.options,
      disabled: true,
    });

    const buttonRows = createButtonRows([
      new EventEditButton(id).setDisabled(true),
      new EventSelectAnswerButton(id).setDisabled(true),
    ]);

    const progressEmbed = createEventEmbed({
      id,
      question: event.question,
      max_participants: event.max_participants,
      event,
      expires_at: event.expires_at,
      status: EventStatus.Counting,
    });

    await discordMessage.edit({
      embeds: progressEmbed,
      components: [updatedSelectMenuRows, buttonRows],
    });

    // Handle the event rewards distribution
    await (async () => {
      await Promise.all(
        event.options.map(async (option) => {
          // Give back the users their money temporarily
          const eventEndRefund = option.votes.map((vote) => {
            return {
              guild_id: event.guild_id,
              event_vote_id: vote.id,
              user_id: vote.user_id,
              amount: vote.amount,
              type: TransactionType.event_end,
            };
          });

          await this.transactionService.createMany({
            data: eventEndRefund,
          });

          if (option.correct) {
            const eventRewards = option.votes.map((vote) => {
              return {
                guild_id: event.guild_id,
                event_vote_id: vote.id,
                user_id: vote.user_id,
                amount: vote.amount * vote.snapshot_bonus_amount_multiplier,
                type: TransactionType.event_win,
              };
            });

            return await this.transactionService.createMany({
              data: eventRewards,
            });
          }

          const eventLosses = option.votes.map((vote) => {
            return {
              guild_id: event.guild_id,
              event_vote_id: vote.id,
              user_id: vote.user_id,
              amount: 0,
              type: TransactionType.event_loss,
            };
          });

          return await this.transactionService.createMany({
            data: eventLosses,
          });
        }),
      );
    })();

    // close the event
    await this.eventService.update(id, {
      closed: true,
    });

    const correct_answers = event.options.filter((option) => option.correct);
    const correct_answers_emoji = correct_answers
      .map((option) => numberToEmoji(option.order))
      .join(', ');

    const embeds = createEventEmbed({
      id,
      question: event.question,
      max_participants: event.max_participants,
      event,
      expires_at: event.expires_at,
      status: EventStatus.Closed,
      correct_answers,
    });

    await discordMessage.edit({
      embeds,
    });

    await channel.send({
      content: `Congratulations to the Storkies who chose ${correct_answers_emoji}! Check your balance for your winnings`,
      reply: {
        messageReference: discordMessage,
      },
    });
  }
}
