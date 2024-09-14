import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { NumberOption } from 'necord';

export class EventBetDto {
  @Type(() => Number)
  @Min(1)
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @NumberOption({
    name: 'amount',
    description: 'Tickets to bet',
    min_value: 1,
    max_value: 1_000_000,
  })
  amount: number;
}
