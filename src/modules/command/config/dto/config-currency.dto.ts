import { StringOption } from 'necord';

export class ConfigCurrencyDto {
  @StringOption({
    name: 'currency',
    description: 'New currency name',
    required: true,
    min_length: 1,
    max_length: 20,
  })
  currency: string;

  @StringOption({
    name: 'symbol',
    description: 'New currency symbol',
    required: true,
    min_length: 1,
    max_length: 10,
  })
  symbol: string;
}
