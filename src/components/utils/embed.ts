import { EmbedBuilder, RGBTuple } from '@discordjs/builders';
import { Colors } from 'discord.js';

interface CreateEmbedBuilderArgs {
  title?: string;
  description?: string;
  color?: (typeof Colors)[keyof typeof Colors] | RGBTuple;
  image?: string;
  thumbnail?: string;
}

const EmbedBuilderPropsMapping = {
  title: 'setTitle',
  description: 'setDescription',
  color: 'setColor',
  image: 'setImage',
  thumbnail: 'setThumbnail',
};

export const createEmbed = ({
  color = Colors.Aqua,
  ...args
}: CreateEmbedBuilderArgs) => {
  const builder = new EmbedBuilder().setColor(color);

  for (const [key, value] of Object.entries(args)) {
    const funcName = EmbedBuilderPropsMapping[key];

    if (funcName) {
      builder[funcName](value);
    }
  }

  return builder;
};

export const createEmbeds = (payload: CreateEmbedBuilderArgs[]) => {
  return payload.map((args) => createEmbed(args));
};
