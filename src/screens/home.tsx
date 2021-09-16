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
      <Box p={1} bgcolor='#e0f2f1'>
        <img src="../logo_transparent_background.png" alt="logo" height="75" />
        <Typography paragraph variant="h5">Schön, dass du dich für einen sauberen Lebensraum engagierst.
      </Typography>
      </Box>

<Box p={2}>
</Box>
      <Box p={1}>
      <Typography variant="h4">Nächster Event</Typography>
      </Box>
      {nextEventCard || <Info text="Kein Event anstehend." />}
    </>
  );
}

export default Home;
