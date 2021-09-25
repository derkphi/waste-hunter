import { EventWithId } from '../../firebase/firebase_types';
import { database } from '../../firebase/config';

export interface EventWithStatistic extends EventWithId {
  users: number;
  duration: number;
  distance: number;
  collected: number;
}

export async function getReportEvents(): Promise<EventWithStatistic[]> {
  return database
    .ref('events')
    .get()
    .then((data) => {
      if (!data.exists()) return [];
      return Object.entries(data.val() as { [id: string]: EventWithId })
        .map(([id, event]) => ({
          ...event,
          id,
          time: Date.parse(`${event.datum}T${event.zeit}`),
          users: event.cleanup ? Object.keys(event.cleanup).length : 0,
          duration: event.cleanup
            ? Object.values(event.cleanup).reduce((p, c) => (p + c.end - c.start > 0 ? c.end - c.start : 0), 0)
            : 0,
          distance: event.cleanup
            ? Object.values(event.cleanup).reduce((p, c) => p + (c.distance && c.distance > 0 ? c.distance : 0), 0)
            : 0,
          collected: event.cleanup ? Object.values(event.cleanup).reduce((p, c) => p + (c.collected || 0), 0) : 0,
        }))
        .sort((a, b) => b.time - a.time)
        .filter((e) => Date.parse(e.datum) < Date.now());
    });
}
