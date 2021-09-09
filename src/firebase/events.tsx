import { EventType } from '../common/firebase_types';

export function filterNext(events: EventType[]) {
  // Get time for events
  let eventsWithTime = [];
  for (const [, event] of Object.entries<EventType>(events)) {
    const time = Date.parse(event.datum + ' ' + event.zeit);
    eventsWithTime.push({ time: time, event: event });
  }

  // Sort by time
  eventsWithTime.sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));

  // Filter out outdated events
  const oldEventsTime = new Date().getTime();
  eventsWithTime = eventsWithTime.filter((item) => item.time > oldEventsTime);

  return eventsWithTime.map((item) => item.event);
}
