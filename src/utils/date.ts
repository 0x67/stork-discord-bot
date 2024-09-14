import { isAfter } from 'date-fns';

export const timestampToDate = (ts: number) => {
  if (Math.abs(Date.now() - ts) < Math.abs(Date.now() - ts * 1000)) {
    return new Date(ts);
  } else {
    return new Date(ts * 1000);
  }
};

export const dateToTimestamp = (date: Date, toMs = false) => {
  date = new Date(date);
  return toMs ? date.getTime() : Math.floor(date.getTime() / 1000);
};

export const isExpired = (date: Date) => {
  return isAfter(new Date(), date);
};
