import React, { useState } from 'react';
import { TextField, Typography, makeStyles, FormLabel, Button, Box } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Routes } from '../components/customRoute';
import EventMap, { fallbackViewport } from '../components/maps/eventMap';
import { database } from '../firebase/config';
import { EventType } from '../common/firebase_types';

const useStyles = makeStyles(() => ({
  field: {
    marginTop: 20,
    marginBottom: 20,
  },
  map: {
    marginTop: 20,
    height: '50vh',
    width: '100%',
    // [theme.breakpoints.down('sm')] : {
    //   height: '75vh',
    //   width: '100%'
    // },
    // [theme.breakpoints.up('md')] : {
    //   height: '100%',
    //   width: '100%'
    // }
  },
  mapGridItem: {
    width: '100%',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

function CreateEvent() {
  const classes = useStyles();
  const history = useHistory();
  const [event, setEvent] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [eventerror, setEventerror] = useState(false);

  const [placeerror, setPlaceerror] = useState(false);
  const [dateerror, setdateerror] = useState(false);
  const [timeerror, settimeerror] = useState(false);
  const [viewport, setViewport] = useState(fallbackViewport);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setEventerror(false);
    setPlaceerror(false);
    setdateerror(false);
    settimeerror(false);

    if (event === '') {
      setEventerror(true);
    }
    if (place === '') {
      setPlaceerror(true);
    }
    if (date === '') {
      setdateerror(true);
    }
    if (time === '') {
      settimeerror(true);
    }
    if (event && place) {
      const newEventKey = database.ref().child('events').push().key;
      const newEvent: EventType = { anlass: event, ort: place, datum: date, zeit: time, position: viewport };
      const updates = {
        ['/events/' + newEventKey]: newEvent,
      };
      database
        .ref()
        .update(updates)
        .then(() => history.push(Routes.calendar));
    }
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h4" color="textPrimary" component="h2" gutterBottom>
        Erfasse einen Event
      </Typography>
      <Grid container spacing={3}>
        <Grid item sm={12} md={5}>
          <FormLabel>Anlass</FormLabel>
          <TextField
            className={classes.field}
            onChange={(e) => setEvent(e.target.value)}
            autoFocus={true}
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={eventerror}
          ></TextField>
          <FormLabel>Treffpunkt</FormLabel>

          <TextField
            className={classes.field}
            onChange={(e) => setPlace(e.target.value)}
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={placeerror}
          >
            <FormLabel>Datum</FormLabel>
          </TextField>
          <FormLabel>Datum</FormLabel>
          <TextField
            className={classes.field}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={dateerror}
          ></TextField>
          <FormLabel>Startzeit Anlass</FormLabel>
          <TextField
            className={classes.field}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={timeerror}
          ></TextField>
        </Grid>
        <Grid item sm={12} md={7} className={classes.mapGridItem}>
          <FormLabel>Suchgebiet</FormLabel>
          <Box className={classes.map}>
            <EventMap onViewportChange={(viewport) => setViewport(viewport)} />
          </Box>
        </Grid>
      </Grid>
      <Button
        className={classes.button}
        type="submit"
        color="secondary"
        variant="contained"
        endIcon={<KeyboardArrowRightIcon />}
      >
        Abschliessen
      </Button>
    </form>
  );
}
export default CreateEvent;
