import {
  createModal,
  CreateTextInputProps,
  createTextInputs,
} from '@/components/utils';
import { dateToTimestamp } from '@/utils';
import { addMinutes } from 'date-fns';
import { TextInputStyle } from 'discord.js';

const CREATE_EVENT_CONFIG: Record<string, CreateTextInputProps> = {
  question: {
    customId: 'question',
    label: 'Question',
    placeholder: 'Will something happened today?',
    style: TextInputStyle.Paragraph,
    defaultValue: 'Will something happened today?',
    minLength: 1,
    maxLength: 500,
  },
  expires_at: {
    customId: 'expires_at',
    label: 'Timestamp (UNIX) at which the event expires',
    placeholder: dateToTimestamp(addMinutes(new Date(), 60)).toString(),
    defaultValue: dateToTimestamp(addMinutes(new Date(), 1)).toString(),
    style: TextInputStyle.Short,
    minLength: 10,
    maxLength: 20,
  },
  base_amount: {
    customId: 'base_amount',
    label: `Minimum bet amount`,
    placeholder: '10',
    style: TextInputStyle.Short,
    defaultValue: '10',
    minLength: 1,
    maxLength: 10,
  },
  bonus_amount_multiplier: {
    customId: 'bonus_amount_multiplier',
    label: 'Reward multiplier, decimals allowed',
    placeholder: '2.5',
    defaultValue: '2.5',
    style: TextInputStyle.Short,
    minLength: 1,
    maxLength: 10,
  },
  max_participants: {
    customId: 'max_participants',
    label: 'Maximum participants',
    placeholder: '10',
    defaultValue: '50',
    style: TextInputStyle.Short,
    minLength: 1,
    maxLength: 10,
  },
};

export const createEventModal = (path: string) => {
  const inputs = createTextInputs(Object.values(CREATE_EVENT_CONFIG));

  const modal = createModal({
    title: 'Create Event',
    id: path,
    components: inputs,
  });

  return modal;
};
