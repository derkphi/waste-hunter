import React, { useEffect, useState } from 'react';
import { EventType, EventWithId } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { Card, CardHeader, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import BasicMap from '../components/maps/basicMap';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

const useStyles = makeStyles({
  card: {
    marginTop: '20px',
  },
  gridItem: {
    width: '100%',
    height: '350px',
    padding: 1,
  },
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
});

interface EventReports {
  [id: string]: { users: number; collected: number; distance: number };
}

export default function Reports() {
  const classes = useStyles();
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [reports, setReports] = useState<EventReports>({});

  async function loadReports(events: EventWithId[]) {
    events.forEach((event) => {
      database
        .ref(`cleanups/${event.id}`)
        .get()
        .then((d) => {
          if (!d.exists()) return;
          const user: { collected?: number; distance?: number }[] = Object.values(d.val()) || [];
          const report = {
            users: user.length,
            collected: user.reduce((p, c) => p + (c.collected || 0), 0),
            distance: user.reduce((p, c) => p + (c.distance || 0), 0),
          };
          setReports((r) => ({ ...r, [event.id]: report }));
        });
    });
  }

  useEffect(() => {
    database
      .ref('events')
      .get()
      .then((d) => {
        const eventEntries: [string, EventType][] = Object.entries(d.val());
        const events: EventWithId[] = eventEntries
          .map(([k, v]) => ({
            ...v,
            id: k,
            time: Date.parse(`${v.datum}T${v.zeit}`),
          }))
          .sort((a, b) => b.time - a.time)
          .filter((e) => Date.parse(e.datum) < Date.now());
        setEvents(events);
        loadReports(events);
      });
  }, []);

  return events.length ? (
    <>
      {events.map((event) => (
        <Card key={event.id} className={classes.card}>
          <CardHeader title={new Date(event.datum).toLocaleDateString('de-CH') + ' - ' + event.anlass} />
          <CardContent style={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item sm={12} md={6} className={classes.gridItem}>
                <BasicMap viewport={event.position}>
                  <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
                </BasicMap>
              </Grid>
              <Grid item sm={12} md={6}>
                <Typography paragraph variant="h6">
                  Treffpunkt bei {event.ort} um {event.zeit} Uhr
                </Typography>
                {reports[event.id] && (
                  <Typography paragraph>
                    Gesammelter Abfall: {Math.round(reports[event.id].collected * 1e2) / 1e2} Liter
                    <br />
                    Teilgenommen: {reports[event.id].users} Person{reports[event.id].users === 1 ? '' : 'en'}
                    <br />
                    Durchschnittliche Strecke:{' '}
                    {Math.round((reports[event.id].distance / reports[event.id].users) * 1e3) / 1e3} km
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </>
  ) : (
    <Info text="Kein Event geplant." />
  );
}
