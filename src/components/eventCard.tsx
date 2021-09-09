import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { EventType } from '../common/firebase_types';
import Map from '../components/map';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '20px',
    },

    mapGridItem: {
      width: '100%',
      height: '350px',
      padding: '1px',
    },
  })
);

interface EventCardProps {
  event: EventType;
  joinEnabled: boolean;
}

function EventCard(props: EventCardProps) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent style={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} className={classes.mapGridItem}>
            <Map initialPosition={props.event.position} />
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography paragraph variant="h6">
              Treffpunkt bei {props.event.ort} um {props.event.zeit} Uhr
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
              disabled={!props.joinEnabled}
            >
              Teilnehmen
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default EventCard;
