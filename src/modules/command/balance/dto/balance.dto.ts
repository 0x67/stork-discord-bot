import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { GuildMember } from 'discord.js';
import { MemberOption, NumberOption } from 'necord';

export class BalanceAmountDto {
  @Type(() => Number)
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: '**Amount** must be a valid number',
    },
  )
  @Min(1, {
    message: '**Amount** must be greater than or equal to 1',
  })
  @Max(1_000_000, {
    message: '**Amount** must be less than or equal to 1,000,000',
  })
  @NumberOption({
    name: 'amount',
    description: 'Amount to give',
    min_value: 1,
    max_value: 1_000_000,
    required: true,
  })
  amount: number;
}

export class BalanceUserDto {
  @MemberOption({
    name: 'user',
    description: 'Select user',
    required: true,
  })
  user: GuildMember;
}
