import { Module } from '@nestjs/common';

import { EventButton } from '@/modules/command/event/event.button';
import { EventCommand } from '@/modules/command/event/event.comand';
import { EventModal } from '@/modules/command/event/event.modal';
import { EventSelect } from '@/modules/command/event/event.select';
import { TRANSACTION_SERVICE, TransactionService } from '@/modules/transaction';
import { EVENT_SERVICE, EventService } from '@/modules/event';

@Module({
  providers: [
    {
      provide: EVENT_SERVICE,
      useClass: EventService,
    },
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
    EventCommand,
    EventModal,
    EventButton,
    EventSelect,
  ],
})
export class EventModule {}
