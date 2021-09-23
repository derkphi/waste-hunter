import React, { useEffect, useState } from 'react';
import { EventType, EventWithId } from '../common/firebase_types';
import Info from '../components/info';
import { database } from '../firebase/config';
import { Card, CardHeader, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import EventMap from '../components/maps/eventMap';
import StatisticGroup from '../components/statistic/statisticGroup';

// red '#f6dfc6'

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

interface EventWithCleanupData extends EventType {
  cleanup?: {
    [uid: string]: {
      uid: string;
      email: string;
      start: number;
      end: number;
      distance: number;
      collected: number;
    };
  };
}

interface EventWithReport extends EventWithId {
  users: number;
  duration: number;
  distance: number;
  collected: number;
}

export default function Reports() {
  const classes = useStyles();
  const [events, setEvents] = useState<EventWithReport[]>([]);

  useEffect(() => {
    database
      .ref('events')
      .get()
      .then((data) => {
        if (!data.exists()) return;
        setEvents(
          Object.entries(data.val() as { [id: string]: EventWithCleanupData })
            .map(([id, event]) => ({
              ...event,
              id,
              time: Date.parse(`${event.datum}T${event.zeit}`),
              users: event.cleanup ? Object.keys(event.cleanup).length : 0,
              duration: event.cleanup ? Math.max(...Object.values(event.cleanup).map((c) => c.end - c.start)) : 0,
              distance: event.cleanup ? Math.max(...Object.values(event.cleanup).map((c) => c.distance)) : 0,
              collected: event.cleanup ? Object.values(event.cleanup).reduce((p, c) => p + (c.collected || 0), 0) : 0,
            }))
            .sort((a, b) => b.time - a.time)
            .filter((e) => Date.parse(e.datum) < Date.now())
        );
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
                <EventMap event={event} />
              </Grid>
              <Grid item sm={12} md={6}>
                <Typography paragraph variant="h6">
                  Event in {event.ort}
                  <br />
                  <br />
                  Erfolg:
                </Typography>
                {event.users > 0 && (
                  <StatisticGroup
                    users={event.users}
                    duration={event.duration}
                    distance={event.distance}
                    collected={event.collected}
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </>
  ) : (
    <Info text="Kein Bericht vorhanden." />
  );
}
