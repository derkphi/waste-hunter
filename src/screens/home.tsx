import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { EventWithId } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { filterNext } from '../firebase/events';
import EventCard from '../components/eventCard';

function Home() {
  const [nextEvent, setNextEvent] = useState<EventWithId>();

  useEffect(() => {
    const dbRef = database.ref('events');
    dbRef.on('value', (snapshot) => {
      const events = filterNext(snapshot.val());
      if (events.length > 0) {
        setNextEvent(events[0]);
      }
    });
    return () => dbRef.off();
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
