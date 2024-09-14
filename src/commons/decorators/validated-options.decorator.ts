import { ValidationPipe } from '@nestjs/common';
import { Options } from 'necord';

export const ValidatedOptions = (...dataOrPipes: any[]) => {
  return Options(
    ...dataOrPipes,
    new ValidationPipe({
      validateCustomDecorators: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );
};
