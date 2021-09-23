import React, { useEffect, useState } from 'react';
import Info from '../components/info';
import { Card, CardHeader, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import EventMap from '../components/maps/eventMap';
import StatisticGroup from '../components/report/statisticGroup';
import { getReportEvents, EventWithStatistic } from '../components/report/reportEvent';

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

export default function Reports() {
  const classes = useStyles();
  const [events, setEvents] = useState<EventWithStatistic[]>([]);

  useEffect(() => {
    getReportEvents().then((reportEvents) => setEvents(reportEvents));
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
                <Typography paragraph variant="h5">
                  Event in {event.ort}
                </Typography>
                <Typography paragraph variant="h6">
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
