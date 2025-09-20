import { dayJs } from './dayjs';

export function utcDateNow() {
  return dayJs().utc().toISOString();
}
