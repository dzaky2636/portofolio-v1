import { pageview } from '@vercel/analytics';

export type TrackedAction = 'cv-download' | 'email-copy';

/**
 * Custom events need a paid Vercel plan, so actions are logged as virtual pages instead.
 * They show up under Pages in the dashboard as /events/<action>.
 */
export function trackAction(action: TrackedAction) {
  const path = `/events/${action}`;
  pageview({ route: path, path });
}
