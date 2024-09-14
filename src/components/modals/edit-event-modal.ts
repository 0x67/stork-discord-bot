import {
  createModal,
  CreateTextInputProps,
  createTextInputs,
} from '@/components/utils';
import { TextInputStyle } from 'discord.js';

const EDIT_EVENT_CONFIG: Record<string, CreateTextInputProps> = {
  base_amount: {
    customId: 'base_amount',
    label: `Minimum bet amount, decimals not allowed`,
    placeholder: '10',
    style: TextInputStyle.Short,
    minLength: 1,
    maxLength: 10,
    required: false,
  },
  bonus_amount_multiplier: {
    customId: 'bonus_amount_multiplier',
    label: 'Reward multiplier, decimals allowed',
    placeholder: '2.5',
    style: TextInputStyle.Short,
    minLength: 1,
    maxLength: 10,
    required: false,
  },
};

export const editEventModal = (path: string) => {
  const inputs = createTextInputs(Object.values(EDIT_EVENT_CONFIG));

  const modal = createModal({
    title: 'Edit Event',
    id: path,
    components: inputs,
  });

  return modal;
};
