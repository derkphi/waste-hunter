import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { EventWithId } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { filterNext } from '../firebase/events';
import EventCard from '../components/eventCard';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

function Home() {
  const [nextEvent, setNextEvent] = useState<EventWithId>();
  const history = useHistory();

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
      <Button onClick={() => history.push('/cleanups/-MjBhEW1_RD6l0ImwvJs')}>/cleanups/-MjBhEW1_RD6l0ImwvJs</Button>

      <Typography variant="h4">Nächster Event</Typography>
      {nextEventCard || <Info text="Kein Event anstehend." />}
    </>
  );
}

export default Home;
