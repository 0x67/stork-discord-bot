import { BaseButton } from '@/components/utils';
import { ButtonStyle } from 'discord.js';

export class EventEditButton extends BaseButton {
  constructor(id: string) {
    super({
      customId: `event/${id}/edit`,
      label: 'Edit',
      style: ButtonStyle.Primary,
    });
  }
}

export class EventCloseButton extends BaseButton {
  constructor(id: string) {
    super({
      customId: `event/${id}/close`,
      label: 'Close',
      style: ButtonStyle.Danger,
    });
  }
}

export class EventOpenButton extends BaseButton {
  constructor(id: string) {
    super({
      customId: `event/${id}/open`,
      label: 'Open',
      style: ButtonStyle.Success,
    });
  }
}

export class EventSelectAnswerButton extends BaseButton {
  constructor(id: string) {
    super({
      customId: `event/${id}/select-answer`,
      label: 'Select Correct Answer',
      style: ButtonStyle.Primary,
    });
  }
}
