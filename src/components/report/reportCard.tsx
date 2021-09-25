import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import EventMap from '../maps/eventMap';
import { EventWithStatistic } from './reportHelper';
import StatisticGroup from './statisticGroup';

const useStyles = makeStyles({
  card: {
    marginTop: '20px',
  },
  gridItem: {
    width: '100%',
    height: '350px',
    padding: 1,
  },
});

interface ReportCardProps {
  event: EventWithStatistic;
}

function ReportCard(props: ReportCardProps) {
  const classes = useStyles();
  return (
    <Card key={props.event.id} className={classes.card}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent style={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} className={classes.gridItem}>
            <EventMap event={props.event} />
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography paragraph variant="h5">
              Event in {props.event.ort}
            </Typography>
            <Typography paragraph variant="h6">
              Erfolg:
            </Typography>
            {props.event.users > 0 && (
              <StatisticGroup
                users={props.event.users}
                duration={props.event.duration}
                distance={props.event.distance}
                collected={props.event.collected}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
