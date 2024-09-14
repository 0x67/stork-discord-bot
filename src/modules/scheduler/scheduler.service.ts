import {
  CloseEventJob,
  CloseEventJobData,
  DistributeEventRewardsJob,
  DistributeEventRewardsJobData,
} from '@/modules/scheduler/jobs';
import { JobService } from '@apricote/nest-pg-boss';
import { Inject, Injectable } from '@nestjs/common';
import { CLOSE_EVENT_JOB_CONFIG, TALLY_EVENT_JOB_CONFIG } from '@/configs';

export const SCHEDULER_SERVICE = 'SCHEDULER_SERVICE';
export const InjectScheduler = () => Inject(SCHEDULER_SERVICE);

@Injectable()
export class SchedulerService {
  constructor(
    @CloseEventJob.Inject()
    private readonly closeEventJob: JobService<CloseEventJobData>,

    @DistributeEventRewardsJob.Inject()
    private readonly distributeEventRewardsJob: JobService<DistributeEventRewardsJobData>,
  ) {}

  async scheduleCloseEventJob(id: string, expires_at: Date) {
    await this.closeEventJob.send({ id }, CLOSE_EVENT_JOB_CONFIG(expires_at));
  }

  async scheduleDistributeEventRewardsJob(id: string) {
    await this.distributeEventRewardsJob.send({ id }, TALLY_EVENT_JOB_CONFIG);
  }
}
