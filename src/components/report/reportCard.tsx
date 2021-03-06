import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import EventMap from '../map/eventMap';
import { EventWithStatistic } from './reportHelper';
import StatisticGroup from './statisticGroup';
import { database } from '../../firebase/config';
import { CleanupUser } from '../../firebase/types';
import firebase from 'firebase/app';
import UserGroup from '../common/userGroup';

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
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>([]);

  useEffect(() => {
    const ref = database.ref(`cleanups/${props.event.id}`);
    const cb = (d: firebase.database.DataSnapshot) => {
      const cleanupData = d.val();
      if (cleanupData) {
        setCleanupUsers(Object.values(d.val()));
      }
    };
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [props.event]);

  return (
    <Card key={props.event.id} className={classes.card}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} className={classes.gridItem}>
            <EventMap event={props.event} cleanups={cleanupUsers}></EventMap>
          </Grid>
          <Grid item sm={12} md={6}>
            <StatisticGroup
              users={cleanupUsers ? cleanupUsers.length : 0}
              duration={props.event.duration}
              distance={props.event.distance}
              collected={props.event.collected}
            />
            {cleanupUsers.length > 0 && (
              <>
                <Typography paragraph variant="h5" style={{ marginTop: '25px' }}>
                  Teilnehmer:
                </Typography>
                <UserGroup userUids={cleanupUsers.map((user) => user.uid)} />
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
