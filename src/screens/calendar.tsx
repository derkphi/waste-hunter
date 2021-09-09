import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Routes } from '../components/customRoute';
import { EventType } from '../common/firebase_types';
import { database } from '../firebase/config';
import EventCard from '../components/eventCard';

function Calendar() {
  let history = useHistory();
  const [events, setEvents] = useState({});

  useEffect(() => {
    const dbRef = database.ref('events');
    const cb = (snapshot: any) => {
      //todo: Use correct type DataSnapshot
      setEvents(snapshot.val());
    };
    dbRef.on('value', cb);
    return () => dbRef.off('value', cb);
  }, []);

  function handleNewEvent() {
    history.push(Routes.createEvent);
  }

  let eventsWithTime = [];
  for (const [, event] of Object.entries<EventType>(events)) {
    console.log(event.anlass);
    const time = Date.parse(event.datum + ' ' + event.zeit);

    eventsWithTime.push({ time: time, event: event });
  }
  eventsWithTime.sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));
  let cards = [];
  for (const item of eventsWithTime) {
    cards.push(<EventCard event={item.event} />);
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleNewEvent}>
        Event erfassen
      </Button>
      {cards}
      {/* <RecipeReviewCard></RecipeReviewCard> */}
    </>
  );
}

export default Calendar;
