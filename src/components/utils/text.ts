import { TextInputBuilder, TextInputStyle } from 'discord.js';

export interface CreateTextInputProps {
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  style?: TextInputStyle;
  customId?: string;
  label?: string;
}

const TextInputPropsMapping = {
  maxLength: 'setMaxLength',
  minLength: 'setMinLength',
  placeholder: 'setPlaceholder',
  defaultValue: 'setValue',
  required: 'setRequired',
  style: 'setStyle',
  customId: 'setCustomId',
  label: 'setLabel',
};

export const createTextInput = ({
  maxLength = 500,
  minLength = 10,
  required = true,
  style = TextInputStyle.Paragraph,
  ...args
}: CreateTextInputProps) => {
  const builder = new TextInputBuilder()
    .setMaxLength(maxLength)
    .setMinLength(minLength)
    .setRequired(required)
    .setStyle(style);

  for (const [key, value] of Object.entries(args)) {
    const func = TextInputPropsMapping[key];
    if (func) {
      builder[func](value);
    }
  }

  return builder;
};

export const createTextInputs = (props: CreateTextInputProps[]) => {
  return props.map((prop) => createTextInput(prop));
};
