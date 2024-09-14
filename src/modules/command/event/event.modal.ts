import { ModalFields } from '@/commons/decorators';
import {
  createButtonRows,
  createEventEmbed,
  createSelectMenu,
  EventEditButton,
} from '@/components';
import { CacheService } from '@/modules/cache';
import {
  EditEventConfigDto,
  EventBetDto,
  EventConfigDto,
  EventSelectedAnswersDto,
} from '@/modules/command/event/dto';
import { EventService, InjectEventService } from '@/modules/event';
import { InjectScheduler, SchedulerService } from '@/modules/scheduler';
import {
  InjectTransactionService,
  TransactionService,
} from '@/modules/transaction';
import { handleReply, isExpired, numberToEmoji } from '@/utils';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { Event, EventOption } from '@prisma/client';
import { TextChannel } from 'discord.js';
import { Context, Modal, ModalContext, ModalParam } from 'necord';

@Injectable()
export class EventModal {
  constructor(
    @InjectEventService() private readonly eventService: EventService,
    private readonly cache: CacheService,
    @InjectScheduler()
    private readonly schedulerService: SchedulerService,
    @InjectTransactionService()
    private readonly transactionService: TransactionService,
  ) {}

  /**
   *  Modal popup for creating an event
   *  show input for question, options, bonus_amount_multiplier, base_amount, expires_at
   */
  @Transactional()
  @Modal('/event/:id')
  async onEvent(
    @Context() [interaction]: ModalContext,
    @ModalParam('id') id: string,
    @ModalFields() dto: EventConfigDto,
  ) {
    const options = await this.cache.get<string[]>(id);

    if (!options) {
      return await interaction.reply({
        content: 'Event options not found!',
        ephemeral: true,
      });
    }

    const event = (await this.eventService.create({
      data: {
        id: id,
        question: dto.question,
        channel_id: interaction.channel.id,
        guild_id: interaction.guild.id,
        created_by: interaction.user.id,
        bonus_amount_multiplier: dto.bonus_amount_multiplier,
        base_amount: dto.base_amount,
        expires_at: dto.expires_at,
        options: {
          createMany: {
            data: options.map((opt, idx) => ({
              value: opt,
              order: idx,
            })),
          },
        },
      },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })) as Event & { options: EventOption[] };

    await interaction.reply({
      content: `Event created with ID: **${id}**`,
      ephemeral: false,
    });

    const selectMenu = createSelectMenu({
      customId: `event/${id}`,
      placeholder: `Select your answer!`,
      options: event.options,
    });

    const channel = interaction.channel as TextChannel;

    /**
     * Create event embeds
     */
    const embeds = createEventEmbed({
      id,
      question: dto.question,
      max_participants: dto.max_participants,
      event: {
        ...event,
        options: event.options.map((opt) => ({
          ...opt,
          votes: [],
        })),
      },
      expires_at: dto.expires_at,
    });

    const editButton = new EventEditButton(id);

    const buttonRows = createButtonRows([editButton]);

    const message = await channel.send({
      embeds,
      components: [selectMenu, buttonRows],
    });

    /**
     * Store message ID in db
     */
    await this.eventService.update(id, {
      message_id: message.id,
    });

    await this.schedulerService.scheduleCloseEventJob(id, dto.expires_at);
  }

  /**
   * Modal popup for editing an event
   * show input for bonus_amount_multiplier and base_amount
   */
  @Modal('/event/:id/edit')
  async onEdit(
    @Context() [interaction]: ModalContext,
    @ModalParam('id') id: string,
    @ModalFields() dto: EditEventConfigDto,
  ) {
    const event = await this.eventService.findOne(id, true);

    if (!event) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** not found!`,
        true,
      );
    }

    if (isExpired(event.expires_at)) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** already expired!`,
        true,
      );
    }

    const updatedEvent = await this.eventService.update(id, {
      bonus_amount_multiplier: dto?.bonus_amount_multiplier ?? undefined,
      base_amount: dto?.base_amount ?? undefined,
    });

    // TODO: refactor this into a service
    /**
     * Update event embeds
     * if bonus_amount_multiplier or base_amount is updated
     *
     */
    if (
      updatedEvent.bonus_amount_multiplier !== event.bonus_amount_multiplier ||
      updatedEvent.base_amount !== event.base_amount
    ) {
      const channel = interaction.channel as TextChannel;

      const embeds = createEventEmbed({
        id,
        question: event.question,
        max_participants: event.max_participants,
        event: {
          ...updatedEvent,
          options: event.options.map((opt) => ({
            ...opt,
            votes: opt.votes,
          })),
        },
        expires_at: event.expires_at,
      });

      const editButton = new EventEditButton(id);

      const buttonRows = createButtonRows([editButton]);

      const message = await channel.messages.fetch(event.message_id);

      await message.edit({
        embeds,
        components: [message.components[0], buttonRows],
      });
    }

    return await handleReply(
      interaction,
      `Event with ID: **${id}** updated!`,
      true,
    );
  }

  /**
   * Modal popup for voting an event
   * show input for amount
   */
  @Modal('/event/:id/vote/:optionId')
  async onVote(
    @Context() [interaction]: ModalContext,
    @ModalParam('id') id: string,
    @ModalParam('optionId') optionId: string,
    @ModalFields() { amount }: EventBetDto,
  ) {
    const event = await this.eventService.findOne(id);

    if (!event) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** not found!`,
        true,
      );
    }

    if (isExpired(event.expires_at)) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** already expired!`,
        true,
      );
    }

    if (amount < event.base_amount) {
      return await handleReply(
        interaction,
        `Minimum bet amount is **${event.base_amount}**`,
        true,
      );
    }

    const user_id = interaction.user.id;

    const balance = await this.transactionService.aggregate({
      guild_id: interaction.guild.id,
      user_id,
    });

    if (balance < amount) {
      return await handleReply(
        interaction,
        `Insufficient balance! Your balance is **${balance}**`,
        true,
      );
    }

    await this.eventService.createUserVote({
      event: {
        connect: {
          id: event.id,
        },
      },
      user_id,
      option: {
        connect: {
          id: optionId,
        },
      },
      transactions: {
        create: {
          amount: -Math.abs(amount),
          guild_id: interaction.guild.id,
          user_id,
          type: 'event_entry',
        },
      },
      amount,
      snapshot_bonus_amount_multiplier: event.bonus_amount_multiplier,
    });

    /**
     * Update event embeds
     */
    const channel = interaction.channel as TextChannel;
    const updatedEvent = await this.eventService.findOne(id, true);

    const embeds = createEventEmbed({
      id,
      question: updatedEvent.question,
      max_participants: updatedEvent.max_participants,
      event: {
        ...updatedEvent,
        options: updatedEvent.options.map((opt) => ({
          ...opt,
          votes: opt.votes,
        })),
      },
      expires_at: updatedEvent.expires_at,
    });

    const message = await channel.messages.fetch(updatedEvent.message_id);

    await message.edit({
      embeds,
      components: message.components,
    });

    return await handleReply(
      interaction,
      `Voted for option **${
        event.options.find((opt) => opt.id === optionId).value
      }** with amount **${amount}**`,
      true,
    );
  }

  /**
   * Modal popup for selecting the correct answer
   * on closed event
   */
  @Transactional()
  @Modal('/event/:id/select-answer')
  async onSelectAnswer(
    @Context() [interaction]: ModalContext,
    @ModalParam('id') id: string,
    @ModalFields() { correct_answers }: EventSelectedAnswersDto,
  ) {
    correct_answers = correct_answers.map((answer) => answer - 1);
    const event = await this.eventService.findOne(id);

    if (!event) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** not found!`,
        true,
      );
    }

    if (event.closed) {
      return await handleReply(
        interaction,
        `Event with ID: **${id}** is already closed!`,
        true,
      );
    }

    /**
     * Update selected answers in db
     */
    const existingAnswers = event.options.map((opt) => opt.order);
    const allAnswersExist = correct_answers.every((answer) =>
      existingAnswers.includes(answer),
    );

    if (!allAnswersExist) {
      return await handleReply(interaction, `Invalid answers!`, true);
    }

    if (allAnswersExist && correct_answers.length === event.options.length) {
      return await handleReply(
        interaction,
        `All answers cannot be correct!`,
        true,
      );
    }

    const option_ids = event.options
      .filter((opt) => correct_answers.includes(opt.order))
      .map((opt) => opt.id);

    await this.eventService.updateSelectedAnswers(id, option_ids);

    /**
     * Schedule reward distribution job
     */
    await this.schedulerService.scheduleDistributeEventRewardsJob(id);

    return await handleReply(
      interaction,
      `Correct answers selected: ${correct_answers.map((id) => numberToEmoji(id)).join(', ')}`,
      true,
    );
  }
}
