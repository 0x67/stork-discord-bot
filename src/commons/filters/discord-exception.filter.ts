import { createEmbeds } from '@/components';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseInteraction, Colors } from 'discord.js';
import {
  ButtonContext,
  ModalContext,
  NecordArgumentsHost,
  SlashCommandContext,
} from 'necord';
import { Logger } from 'nestjs-pino';

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  public async catch(error: Error, host: ArgumentsHost) {
    const context = NecordArgumentsHost.create(host).getContext<
      ModalContext | ButtonContext | SlashCommandContext
    >();

    const interaction = context[0];

    const json = JSON.parse(
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );

    if (interaction && interaction instanceof BaseInteraction) {
      const log = await this.prisma.log.create({
        data: {
          channel_id: interaction.channel.id,
          guild_id: interaction.guild.id,
          user_id: interaction.user.id,
          message: error.message,
          error: json,
          interaction: interaction.toJSON() as Prisma.JsonObject,
        },
      });

      this.logger.error(log);

      const isReplied = interaction.replied || interaction.deferred;

      if (error instanceof BadRequestException) {
        const response = error.getResponse() as {
          message: string | string[];
        };

        const embeds = createEmbeds([
          {
            color: Colors.Red,
            title: 'Invalid input',
            description: Array.isArray(response.message)
              ? response.message.join('\n')
              : response.message,
          },
        ]);

        if (isReplied) {
          return await interaction.followUp({
            embeds,
            ephemeral: true,
          });
        }

        return await interaction.reply({
          embeds,
          ephemeral: true,
        });
      }

      const embeds = createEmbeds([
        {
          color: Colors.Red,
          title: 'Unknown error occurred',
          description: `Error id: \`${log.id}\``,
        },
      ]);

      if (isReplied) {
        return await interaction.followUp({
          embeds,
          ephemeral: true,
        });
      }

      return await interaction.reply({
        embeds,
        ephemeral: true,
      });
    }

    const log = await this.prisma.log.create({
      data: {
        message: error?.message || 'Unknown error',
        error: json,
      },
    });

    this.logger.error(log);
  }
}
