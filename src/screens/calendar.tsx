import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Routes } from '../components/customRoute';
import { EventWithId } from '../firebase/types';
import { database } from '../firebase/config';
import EventCard from '../components/event/eventCard';
import Info from '../components/info';
import { filterNext, getTimeMs } from '../components/event/eventHelper';
import firebase from 'firebase/app';

const alertWindow = 5 * 60e3; // +/- 5 minutes

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
    const cb = (d: firebase.database.DataSnapshot) => setEvents(filterNext(d.val()));
    dbRef.on('value', cb);

    return () => dbRef.off('value', cb);
  }, []);

  useEffect(() => {
    const checkAlert = () => {
      if (events) {
        const currentTime = new Date().getTime();
        for (const event of events) {
          const eventTime = getTimeMs(event);
          // Alert Event started +/ 5 minutes
          if (eventTime - alertWindow < currentTime && currentTime < eventTime + alertWindow) {
            setHasTime(true);
            return;
          }
        }
      }
      setHasTime(false);
    };
    checkAlert();
    const checkInterval = setInterval(checkAlert, 10000);
    return () => clearInterval(checkInterval);
  }, [events]);

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
      {hasTime && <Info text={'Der nächste Event startet: Mit Teilnehmen kannst du auf die Liveansicht wechseln.'} />}
      {cards.length > 0 ? cards : <Info text="Kein Event geplant." />}
    </>
  );
}

export default Calendar;
