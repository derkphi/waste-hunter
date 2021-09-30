import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Routes } from '../components/customRoute';
import { EventWithId } from '../firebase/firebase_types';
import { database, DataSnapshot } from '../firebase/config';
import EventCard from '../components/event/eventCard';
import Info from '../components/info';
import { filterNext } from '../components/event/eventHelper';

function deleteEvent(id: string) {
  const dbRef = database.ref('events/' + id);
  dbRef.remove();
}

function Calendar() {
  let history = useHistory();
  const [events, setEvents] = useState<EventWithId[]>();
  const [hasTime, setHasTime] = useState(false);

  useEffect(() => {
    const dbRef = database.ref('events');
    const cb = (d: DataSnapshot) => setEvents(filterNext(d.val()));
    dbRef.on('value', cb);

    // Alert Event started +/ 5 minutes

    if (-5 < 0 || 0 < 5) {
      setHasTime(true);
    } else {
      setHasTime(false);
    }

    return () => dbRef.off('value', cb);
  }, []);

  const today = new Date(); // Get current date and time
  today.setHours(0, 0, 0, 0); // Set time to midnight
  const actualtime = today.getTime();
  console.log('actualime', actualtime);

  function handleNewEvent() {
    history.push(Routes.createEvent);
  }

  let cards: JSX.Element[] = [];
  if (events && events.length > 0) {
    events.forEach((item, idx) => {
      cards.push(<EventCard key={idx} event={item} joinEnabled={idx === 0} showEditDelete deleteClick={deleteEvent} />);
    });
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleNewEvent} style={{ marginBottom: '20px' }}>
        Event erfassen
      </Button>
      {hasTime && <Info text={'Der Event startet: Mit Teilnehmen kannst du auf die Liveansicht wechseln.'} />}
      {cards.length > 0 ? cards : <Info text="Kein Event geplant." />}
    </>
  );
}

export default Calendar;
