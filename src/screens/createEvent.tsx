import React, { useState, useEffect } from 'react';
import { TextField, Typography, makeStyles, FormLabel, Button, Box } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { Routes } from '../components/customRoute';
import CreateEventMap from '../components/map/createEventMap';
import { database } from '../firebase/config';
import { EventType, MeetingPointType } from '../firebase/types';

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: 20,
    marginBottom: 20,
  },
  map: {
    marginTop: 20,
    height: '50vh',
    width: '100%',
  },
  mapFull: {
    position: 'fixed',
    boxSizing: 'border-box',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingBottom: '5px',
    zIndex: 2000,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#FFF',
  },
  mapGridItem: {
    width: '100%',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  zoomButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    minWidth: 0,
  },
}));

const fallbackViewport = {
  latitude: 46.8131873,
  longitude: 8.22421,
  zoom: 7,
};

function CreateEvent() {
  const classes = useStyles();
  const history = useHistory();
  const [mapFull, setMapFull] = useState(false);

  const [event, setEvent] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [viewport, setViewport] = useState(fallbackViewport);
  const [searchArea, setSearchArea] = useState<GeoJSON.Feature<GeoJSON.Polygon> | undefined>(undefined);
  const [meetingPoint, setMeetingPoint] = useState<MeetingPointType | undefined>(undefined);

  const [eventerror, setEventerror] = useState(false);
  const [placeerror, setPlaceerror] = useState(false);
  const [dateerror, setdateerror] = useState(false);
  const [timeerror, settimeerror] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      database
        .ref(`events/${id}`)
        .get()
        .then((d) => {
          setEvent(d.val().anlass);
          setPlace(d.val().ort);
          setDate(d.val().datum);
          setTime(d.val().zeit);
          setViewport(d.val().position);
          setSearchArea(d.val().searchArea);
          setMeetingPoint(d.val().meetingPoint);
        });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      let eventKey;
      if (id) {
        eventKey = id;
      } else {
        eventKey = database.ref().child('events').push().key;
      }
      const eventData: EventType = {
        anlass: event,
        ort: place,
        datum: date,
        zeit: time,
        position: viewport,
      };
      if (searchArea) eventData.searchArea = searchArea;
      if (meetingPoint) eventData.meetingPoint = meetingPoint;
      database
        .ref(`/events/${eventKey}`)
        .update(eventData)
        .then(() => history.push(Routes.calendar));
    }
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h4" color="textPrimary" component="h2" gutterBottom>
        {id ? 'Passe den Event an' : 'Erfasse einen Event'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item sm={12} md={5}>
          <FormLabel>Anlass</FormLabel>
          <TextField
            className={classes.field}
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
            }}
            autoFocus={true}
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={eventerror}
          />
          <FormLabel>Treffpunkt</FormLabel>
          <TextField
            className={classes.field}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={placeerror}
          />
          <FormLabel>Datum</FormLabel>
          <TextField
            className={classes.field}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={dateerror}
          />
          <FormLabel>Startzeit Anlass</FormLabel>
          <TextField
            className={classes.field}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={timeerror}
          />
        </Grid>
        <Grid item sm={12} md={7} className={classes.mapGridItem}>
          <Box className={mapFull ? classes.mapFull : classes.map}>
            <CreateEventMap
              useGeoLocation={id === undefined}
              viewport={viewport}
              onViewportChange={(viewport) => setViewport(viewport)}
              searchArea={searchArea}
              onSearchAreaChange={(sa) => setSearchArea(sa)}
              meetingPoint={meetingPoint}
              onMeetingPointChange={(c) => {
                if (c) {
                  setMeetingPoint({ longitude: c.longitude, latitude: c.latitude });
                } else {
                  setMeetingPoint(undefined);
                }
              }}
            >
              <Button
                onClick={() => setMapFull(!mapFull)}
                color={mapFull ? 'primary' : 'secondary'}
                variant="contained"
                className={classes.zoomButton}
              >
                {mapFull ? <CloseIcon /> : <ZoomOutMapIcon />}
              </Button>
            </CreateEventMap>
          </Box>
        </Grid>
      </Grid>
      <Button
        className={classes.button}
        type="submit"
        color="primary"
        variant="contained"
        endIcon={<KeyboardArrowRightIcon />}
      >
        Abschliessen
      </Button>
      <Button
        className={classes.button}
        color="secondary"
        style={{ marginLeft: 10 }}
        onClick={() => history.push(Routes.calendar)}
      >
        Abbrechen
      </Button>
    </form>
  );
}
export default CreateEvent;
