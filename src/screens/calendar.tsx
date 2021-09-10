import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Routes } from '../components/customRoute';
import { EventWithId } from '../common/firebase_types';
import { database } from '../firebase/config';
import EventCard from '../components/eventCard';
import Info from '../components/info';
import { filterNext } from '../firebase/events';
import firebase from 'firebase/app';

function Calendar() {
  let history = useHistory();
  const [events, setEvents] = useState<EventWithId[]>();

  useEffect(() => {
    const dbRef = database.ref('events');
    const cb = (d: firebase.database.DataSnapshot) => setEvents(filterNext(d.val()));
    dbRef.on('value', cb);
    return () => dbRef.off('value', cb);
  }, []);

  function handleNewEvent() {
    history.push(Routes.createEvent);
  }

  let cards: JSX.Element[] = [];
  if (events && events.length > 0) {
    events.forEach((item, idx) => {
      cards.push(<EventCard key={idx} event={item} joinEnabled={idx === 0} />);
    });
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleNewEvent}>
        Event erfassen
      </Button>
      {cards.length > 0 ? cards : <Info text="Kein Event geplant." />}
      {/* <RecipeReviewCard></RecipeReviewCard> */}
    </>
  );
}

export default Calendar;
