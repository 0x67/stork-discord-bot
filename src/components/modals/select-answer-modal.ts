import {
  createModal,
  CreateTextInputProps,
  createTextInputs,
} from '@/components/utils';
import { TextInputStyle } from 'discord.js';

const SELECT_ANSWER_CONFIG = (optionLength = 2) =>
  ({
    correct_answers: {
      customId: 'correct_answers',
      label: 'Separated by comma i.e, 1,2,3',
      placeholder: `1-${optionLength}`,
      style: TextInputStyle.Short,
      minLength: 1,
      maxLength: 10,
    },
  }) as Record<string, CreateTextInputProps>;

export const selectAnswerModal = (path: string, totalOptions: number) => {
  const inputs = createTextInputs(
    Object.values(SELECT_ANSWER_CONFIG(totalOptions)),
  );

  const modal = createModal({
    title: 'Select correct answers, can be multiple!',
    id: path,
    components: inputs,
  });

  return modal;
};
