import { ActionRowBuilder, ButtonStyle } from 'discord.js';
import { ButtonBuilder } from '@discordjs/builders';

interface CreateButtonArgs {
  customId: string;
  label: string;
  style: ButtonStyle;
  disabled?: boolean;
}
export const createButton = ({
  customId,
  label,
  style = ButtonStyle.Primary,
  disabled = false,
}: CreateButtonArgs) => {
  const builder = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style)
    .setDisabled(disabled);

  return builder;
};

export const createButtonRows = (buttons: ButtonBuilder[]) => {
  return new ActionRowBuilder().addComponents(
    buttons,
  ) as ActionRowBuilder<ButtonBuilder>;
};

export class BaseButton extends ButtonBuilder {
  constructor(args: CreateButtonArgs) {
    super();
    this.setCustomId(args.customId);
    this.setLabel(args.label);
    this.setStyle(args.style);
    this.setDisabled(args.disabled ?? false);
  }

  static Primary = ButtonStyle.Primary;
  static Secondary = ButtonStyle.Secondary;
  static Success = ButtonStyle.Success;
  static Danger = ButtonStyle.Danger;
}
