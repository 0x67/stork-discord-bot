import { ModalFields } from '@/commons/decorators';
import { BalanceAmountDto } from '@/modules/command/balance/dto';
import {
  InjectTransactionService,
  TransactionService,
} from '@/modules/transaction';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { Modal, Context, ModalContext, ModalParam } from 'necord';

@Injectable()
export class BalanceModal {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: TransactionService,
  ) {}

  @Transactional()
  @Modal('/give/:interactionId/:userId')
  async onGive(
    @Context() [interaction]: ModalContext,
    @ModalFields()
    { amount }: BalanceAmountDto,
    @ModalParam('userId') userId: string,
  ) {
    await interaction.reply({
      content: 'Generating money from the void...',
      ephemeral: true,
    });

    await this.transactionService.create({
      data: {
        guild_id: interaction.guild.id,
        user_id: userId,
        amount,
        type: TransactionType.admin_gift,
      },
    });

    await interaction.followUp({
      content: `<@${userId}> awarded with **${amount}** coins!`,
      ephemeral: true,
    });
  }

  @Transactional()
  @Modal('/remove/:interactionId/:userId')
  async onRemove(
    @Context() [interaction]: ModalContext,
    @ModalFields()
    { amount }: BalanceAmountDto,
    @ModalParam('userId') userId: string,
  ) {
    await interaction.reply({
      content: 'Searching hidden stashes',
      ephemeral: true,
    });

    const balance = await this.transactionService.aggregate({
      guild_id: interaction.guild.id,
      user_id: userId,
    });

    if (balance < amount) {
      return await interaction.followUp({
        content: `Unable to remove **${amount}** from <@${userId}>. They only have **${balance}**`,
      });
    }

    await this.transactionService.create({
      data: {
        guild_id: interaction.guild.id,
        user_id: userId,
        amount: -Math.abs(amount),
        type: TransactionType.admin_remove,
      },
    });

    await interaction.followUp({
      content: `Removed **${amount}** from <@${userId}>`,
    });
  }
}
