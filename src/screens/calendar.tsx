import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Routes } from '../components/customRoute';

function Calendar() {
  let history = useHistory();
  
  function handleNewEvent() {
    history.push(Routes.createEvent);
  }
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleNewEvent}>
        Event erfassen
      </Button>
    </>
  );
}

export default Calendar;