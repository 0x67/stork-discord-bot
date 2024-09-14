import { addSeconds } from 'date-fns';

const BASE_SCHEDULER_CONFIG = {
  retryLimit: 10,
  retryDelay: 20, // in seconds
  expireInHours: 12,
};

export const CLOSE_EVENT_JOB_CONFIG = (expiresAt: Date) => ({
  ...BASE_SCHEDULER_CONFIG,
  startAfter: addSeconds(new Date(expiresAt), 30),
});

export const TALLY_EVENT_JOB_CONFIG = {
  ...BASE_SCHEDULER_CONFIG,
  startAfter: addSeconds(new Date(), 5),
};
