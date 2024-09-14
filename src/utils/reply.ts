import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';

export const handleReply = async (
  interaction:
    | ModalSubmitInteraction
    | ButtonInteraction
    | StringSelectMenuInteraction,
  message: string,
  ephemeral = false,
) => {
  if (interaction.replied) {
    return await interaction.followUp({
      content: message,
      ephemeral,
    });
  }

  return await interaction.reply({
    content: message,
    ephemeral,
  });
};
