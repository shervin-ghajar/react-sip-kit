import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
/* -------------------------------------------------------------------------- */
export const formatDuration = (seconds: number) => {
  const duration = dayjs.duration(seconds, 'second');
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${duration.minutes()}m ${duration.seconds()}s`;
  return `${duration.hours()}h ${duration.minutes()}m`;
};
