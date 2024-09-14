import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { StringOption } from 'necord';

export class EventSelectedAnswersDto {
  @Transform(({ value }) => value.split(',').map(Number))
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    { each: true },
  )
  @StringOption({
    name: 'correct_answers',
    description: 'Correct answers, separated by commas (e.g. 1,2,3)',
  })
  correct_answers: number[];
}
