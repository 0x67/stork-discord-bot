import { Global, Module } from '@nestjs/common';
import { SCHEDULER_SERVICE, SchedulerService } from './scheduler.service';
import { JobHandler } from '@/modules/scheduler/job.handler';
import { PGBossModule } from '@apricote/nest-pg-boss';
import {
  DistributeEventRewardsJob,
  CloseEventJob,
} from '@/modules/scheduler/jobs';
import { EVENT_SERVICE, EventService } from '@/modules/event';
import { TRANSACTION_SERVICE, TransactionService } from '@/modules/transaction';

@Global()
@Module({
  imports: [PGBossModule.forJobs([CloseEventJob, DistributeEventRewardsJob])],
  providers: [
    {
      provide: SCHEDULER_SERVICE,
      useClass: SchedulerService,
    },
    JobHandler,
    {
      provide: EVENT_SERVICE,
      useClass: EventService,
    },
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
  exports: [SCHEDULER_SERVICE],
})
export class SchedulerModule {}
