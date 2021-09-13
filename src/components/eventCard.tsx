import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Button, Box } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { EventWithId } from '../common/firebase_types';
import Map from '../components/map';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Routes } from '../components/customRoute';
import { useHistory } from 'react-router-dom';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: '20px',
      marginBottom: '20px',
    },
    content: {
      display: 'flex',
      gap: '20px',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
      },
    },
    map: {
      boxSizing: 'border-box',
      height: '350px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      [theme.breakpoints.up('md')]: {
        width: '50%',
      },
    },
    info: {
      boxSizing: 'border-box',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      [theme.breakpoints.up('md')]: {
        width: '50%',
      },
    },
    iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
  })
);

interface EventCardProps {
  event: EventWithId;
  joinEnabled: boolean;
}

function EventCard(props: EventCardProps) {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent className={classes.content}>
        <Box className={classes.map}>
          <Map initialPosition={props.event.position}>
            <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
          </Map>
        </Box>
        <Box className={classes.info}>
          <Typography paragraph variant="h6">
            Treffpunkt bei {props.event.ort} um {props.event.zeit} Uhr
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={!props.joinEnabled}
            onClick={() => history.push(Routes.cleanup.replace(':id', props.event.id))}
          >
            Teilnehmen
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EventCard;
