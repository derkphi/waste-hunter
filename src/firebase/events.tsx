import { EventWithId, EventType } from '../common/firebase_types';

export function filterNext(events: { [id: string]: EventType }): EventWithId[] {
  // Get time for events
  let eventsWithIdAndTime = [];
  for (const [id, event] of Object.entries(events)) {
    const time = Date.parse(event.datum + ' ' + event.zeit);
    eventsWithIdAndTime.push({ id, time, event });
  }

  // Sort by time
  eventsWithIdAndTime.sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));

  // Filter out outdated events
  const oldEventsTime = new Date().getTime();
  eventsWithIdAndTime = eventsWithIdAndTime.filter((item) => item.time > oldEventsTime);

  return eventsWithIdAndTime.map((item) => ({ ...item.event, id: item.id }));
}
