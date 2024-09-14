import { createModal, createTextInput } from '@/components';
import { BalanceUserDto, BalanceInfoDto } from '@/modules/command/balance/dto';
import {
  InjectTransactionService,
  TransactionService,
} from '@/modules/transaction';
import { hasAdminRoles } from '@/utils';
import { Injectable } from '@nestjs/common';
import { GuildMember, TextInputStyle } from 'discord.js';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class BalanceCommand {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * @description Check balance command
   * @usage `PREFIXinfo or PREFIXinfo [user]
   */
  @SlashCommand({
    name: 'info',
    description: 'Check your balance',
  })
  async onInfo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: BalanceInfoDto,
  ) {
    await interaction.reply({
      content: 'Checking balance...',
      ephemeral: true,
    });

    let userId = interaction.member.user.id;
    let otherUser = false;

    if (user) {
      if (!hasAdminRoles(interaction.member as GuildMember)) {
        return await interaction.reply({
          content: 'Only admin can check other user balance!',
          ephemeral: true,
        });
      }

      userId = user.user.id;
      otherUser = true;
    }

    const balance = await this.transactionService.aggregate({
      guild_id: interaction.guild.id,
      user_id: userId,
    });

    if (otherUser) {
      return await interaction.editReply({
        content: `${user.displayName} balance is: **${balance}**`,
      });
    }

    return await interaction.editReply({
      content: `Your balance is: **${balance}**`,
    });
  }

  /**
   * @description Give currency to user
   * @usage `PREFIXgive [user]
   */
  @SlashCommand({
    name: 'give',
    description: 'Give someone some tickets',
  })
  async onGive(
    @Context() [interaction]: SlashCommandContext,
    @Options() dto: BalanceUserDto,
  ) {
    if (dto.user.user.bot) {
      return await interaction.reply({
        content: 'Target member is a bot!',
        ephemeral: true,
      });
    }

    if (!hasAdminRoles(interaction.member as GuildMember)) {
      return await interaction.reply({
        content: 'Only admin can give tickets!',
        ephemeral: true,
      });
    }

    const amountInput = createTextInput({
      customId: 'amount',
      minLength: 1,
      maxLength: 10,
      label: 'Amount to give',
      placeholder: 'Enter the amount',
      required: true,
      style: TextInputStyle.Short,
    });

    const modal = createModal({
      title: 'Confirm',
      id: `/give/${interaction.id}/${dto.user.user.id}`,
      components: [amountInput],
    });

    return await interaction.showModal(modal);
  }

  /**
   * @description Remove currency from user
   * @usage `PREFIXremove [user]
   */
  @SlashCommand({
    name: 'remove',
    description: 'Remove tickets from someone',
  })
  async onRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() dto: BalanceUserDto,
  ) {
    if (dto.user.user.bot) {
      return await interaction.reply({
        content: 'Target member is a bot!',
        ephemeral: true,
      });
    }
    if (!hasAdminRoles(interaction.member as GuildMember)) {
      return await interaction.reply({
        content: 'Only admin can remove tickets!',
        ephemeral: true,
      });
    }

    const amountInput = createTextInput({
      customId: 'amount',
      minLength: 1,
      maxLength: 10,
      label: 'Amount to remove',
      placeholder: 'Enter the amount',
      required: true,
      style: TextInputStyle.Short,
    });

    const modal = createModal({
      title: 'Confirm',
      id: `/remove/${interaction.id}/${dto.user.user.id}`,
      components: [amountInput],
    });

    return await interaction.showModal(modal);
  }
}
