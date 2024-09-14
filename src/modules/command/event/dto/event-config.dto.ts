import { IsNotPastDate } from '@/commons/decorators';
import { EventOptionsDto } from '@/modules/command/event/dto';
import { timestampToDate } from '@/utils';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { Min } from 'class-validator';

export class EventConfigDto {
  @Type(() => String)
  question: string;

  @Transform(({ value }) => timestampToDate(value))
  @IsNotPastDate()
  expires_at: Date;

  @Type(() => Number)
  @Min(1, { message: 'Base amount must be at least 1' })
  base_amount: number;

  @Type(() => Number)
  @Min(1, { message: 'Bonus amount multiplier must be at least 1' })
  bonus_amount_multiplier: number;

  @Type(() => Number)
  @Min(2, { message: 'Max participants must be at least 2' })
  max_participants: number;

  // @Type(() => EventOptionsDto)
  options: EventOptionsDto;
}

export class EditEventConfigDto extends PartialType(
  PickType(EventConfigDto, ['base_amount', 'bonus_amount_multiplier']),
) {}
