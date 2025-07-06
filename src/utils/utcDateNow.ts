import { dayJs } from './dayjs';

export function utcDateNow() {
  return dayJs().utc().format('YYYY-MM-DD HH:mm:ss UTC');
}
