import {
  ActionRowBuilder,
  APISelectMenuOption,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

interface CreateSelectMenuOptionsArgs {
  id: string;
  value: string;
}

const createSelectMenuOptions = (args: CreateSelectMenuOptionsArgs[]) => {
  return args.map(({ id, value }) => {
    return new StringSelectMenuOptionBuilder().setLabel(value).setValue(id);
  }) as StringSelectMenuOptionBuilder[] | APISelectMenuOption[];
};

interface CreateSelectMenuArgs {
  customId: string;
  placeholder?: string;
  disabled?: boolean;
  options:
    | CreateSelectMenuOptionsArgs[]
    | (StringSelectMenuOptionBuilder[] | APISelectMenuOption[]);
}

export const createSelectMenu = ({
  customId,
  placeholder,
  options,
  disabled = false,
}: CreateSelectMenuArgs) => {
  const builder = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder ?? 'Vote now!')
    .setDisabled(disabled);

  if (options && options.length) {
    try {
      builder.addOptions(
        createSelectMenuOptions(options as CreateSelectMenuOptionsArgs[]),
      );
    } catch {
      builder.addOptions(
        options as StringSelectMenuOptionBuilder[] | APISelectMenuOption[],
      );
    }
  }

  const actionBuilder = new ActionRowBuilder().addComponents(builder);
  return actionBuilder as ActionRowBuilder<StringSelectMenuBuilder>;
};
