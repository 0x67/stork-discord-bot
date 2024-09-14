import { createJob } from '@apricote/nest-pg-boss';

export type CloseEventJobData = {
  id: string;
};

export const CloseEventJob = createJob<CloseEventJobData>('close-poll');
