import { EventWithId, EventType } from '../../firebase/types';

export function filterNext(events: { [id: string]: EventType } = {}): EventWithId[] {
  // Get time for events
  let eventsWithIdAndTime = [];
  for (const [id, event] of Object.entries(events)) {
    const time = Date.parse(event.datum + 'T' + event.zeit);
    eventsWithIdAndTime.push({ id, time, event });
  }

  // Sort by time
  eventsWithIdAndTime.sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));

  // Filter out outdated events
  const today = new Date(); // Get current date and time
  today.setHours(0, 0, 0, 0); // Set time to midnight

  eventsWithIdAndTime = eventsWithIdAndTime.filter((item) => {
    return item.time > today.getTime();
  });

  return eventsWithIdAndTime.map((item) => ({ ...item.event, id: item.id }));
}
