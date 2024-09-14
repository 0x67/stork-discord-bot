import { createJob } from '@apricote/nest-pg-boss';

export type DistributeEventRewardsJobData = {
  id: string;
};

export const DistributeEventRewardsJob =
  createJob<DistributeEventRewardsJobData>('distribute-event-rewards');
