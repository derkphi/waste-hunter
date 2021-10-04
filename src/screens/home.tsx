import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import { EventWithId } from '../firebase/types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { filterNext } from '../components/event/eventHelper';
import EventCard from '../components/event/eventCard';
import firebase from 'firebase/app';
import StatisticCard from '../components/report/statisticCard';

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
      <Box p={1} bgcolor="#e0f2f1">
        <img src="../logo_transparent_background.png" alt="logo" height="75" />
        <Typography paragraph variant="h5">
          Schön, dass du dich für einen sauberen Lebensraum engagierst.
        </Typography>
      </Box>

      <Box p={2}></Box>
      <Box p={1}>
        <Typography variant="h4">Gruppe Bern</Typography>
      </Box>
      <Box p={1}></Box>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <Typography variant="h5">Nächster Event</Typography>
          {nextEventCard || <Info text="Kein Event anstehend." />}
        </Grid>
        <Grid item sm={12} md={6}>
          <Typography variant="h5">Statistik</Typography>
          <StatisticCard />
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
