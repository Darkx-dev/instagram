import { formatDistanceToNow } from 'date-fns';

export function formatSQLiteCreatedAt(createdAt: Date): string {
  const distance = formatDistanceToNow(createdAt, { addSuffix: false });

  if (distance.includes('less than a minute')) return '0m';

  return distance
    .replace('about ', '')
    .replace(/ minutes?/, 'm')
    .replace(/ hours?/, 'h')
    .replace(/ days?/, 'd')
    .replace(/ weeks?/, 'w')
    .replace(/ months?/, 'm')
    .replace(/ years?/, 'y');
}
