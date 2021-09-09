import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { EventType } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { filterNext } from '../firebase/events';
import EventCard from '../components/eventCard';

function Home() {
  const [nextEvent, setNextEvent] = useState<EventType>();

  useEffect(() => {
    const dbRef = database.ref('events');
    const cb = (snapshot: any) => {
      //todo: Use correct type DataSnapshot
      const events = filterNext(snapshot.val());
      if (events.length > 0) {
        setNextEvent(events[0]);
      }
    };
    dbRef.on('value', cb);
    return () => dbRef.off('value', cb);
  }, []);

  const nextEventCard = nextEvent ? <EventCard event={nextEvent} joinEnabled={true} /> : undefined;

  return (
    <>
      <Typography variant="h4">Nächster Event</Typography>
      {nextEventCard || <Info text="Kein Event anstehend." />}
    </>
  );
}

export default Home;
