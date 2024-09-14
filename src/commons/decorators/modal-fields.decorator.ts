import { createParamDecorator, ValidationPipe } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ModalContext, NecordArgumentsHost } from 'necord';

export const ModalFields = () =>
  createParamDecorator((_: unknown, host: ExecutionContextHost) => {
    const [interaction] =
      NecordArgumentsHost.create(host).getContext<ModalContext>();

    const payload = {} as Record<string, string>;

    interaction.fields.fields.each(
      (field) => (payload[field.customId] = field.value),
    );

    return payload;
  })(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
    }),
  );
