import { Module } from '@nestjs/common';
import { EVENT_SERVICE, EventService } from './event.service';

@Module({
  providers: [
    {
      provide: EVENT_SERVICE,
      useClass: EventService,
    },
  ],
  exports: [EVENT_SERVICE],
})
export class EventModule {}
