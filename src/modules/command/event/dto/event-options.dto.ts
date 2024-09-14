import { StringOption } from 'necord';

export class EventOptionsDto {
  @StringOption({
    name: 'option_1',
    description: 'Option 1',
    required: true,
  })
  option_1: string;

  @StringOption({
    name: 'option_2',
    description: 'Option 2',
    required: true,
  })
  option_2: string;

  @StringOption({
    name: 'option_3',
    description: 'Option 3',
  })
  option_3?: string | null;

  @StringOption({
    name: 'option_4',
    description: 'Option 4',
  })
  option_4?: string;

  @StringOption({
    name: 'option_5',
    description: 'Option 5',
  })
  option_5?: string;

  @StringOption({
    name: 'option_6',
    description: 'Option 6',
  })
  option_6?: string;

  @StringOption({
    name: 'option_7',
    description: 'Option 7',
  })
  option_7?: string;

  @StringOption({
    name: 'option_8',
    description: 'Option 8',
  })
  option_8?: string;

  @StringOption({
    name: 'option_9',
    description: 'Option 9',
  })
  option_9?: string;

  @StringOption({
    name: 'option_10',
    description: 'Option 10',
  })
  option_10?: string;
}
