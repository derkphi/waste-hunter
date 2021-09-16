import React, { useEffect, useState } from 'react';
import { Typography,Box } from '@material-ui/core';
import { EventWithId } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { filterNext } from '../firebase/events';
import EventCard from '../components/eventCard';
import firebase from 'firebase/app';

function Home() {
  const [nextEvent, setNextEvent] = useState<EventWithId>();

  useEffect(() => {
    const dbRef = database.ref('events');
    const cb = (d: firebase.database.DataSnapshot) => {
      const events = filterNext(d.val());
      if (events.length > 0) setNextEvent(events[0]);
    };
    dbRef.on('value', cb);
    return () => dbRef.off('value', cb);
  }, []);

  const nextEventCard = nextEvent ? <EventCard event={nextEvent} joinEnabled={true} /> : undefined;

  return (
    <>
      <Box p={1}>
        <img src="../logo_transparent_background.png" alt="logo" height="75" />
        <Typography variant="h6">Schön das du dich für einen sauberen Lebensraum engagieren willst.
        </Typography>
        <Typography variant="h6">Die Waste Hunter Community ist auch in deiner Gegend aktiv und organisiert Cleaning Events.

        </Typography>

      </Box>
      <Box p={1}>

      </Box>

      <Typography variant="h4">Nächster Event</Typography>
      {nextEventCard || <Info text="Kein Event anstehend." />}
    </>
  );
}

export default Home;
