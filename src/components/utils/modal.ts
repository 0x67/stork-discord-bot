import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
} from 'discord.js';

interface CreateModalProps {
  title: string;
  id: string;
  components: ModalActionRowComponentBuilder[];
}

export const createModal = ({ title, id, components }: CreateModalProps) => {
  const builder = new ModalBuilder().setTitle(title).setCustomId(id);

  if (components && components.length) {
    builder.setComponents(
      ...components.map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
          component,
        ]),
      ),
    );
  }

  return builder;
};
