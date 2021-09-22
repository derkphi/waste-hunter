import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Badge, Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { EventWithId } from '../common/firebase_types';
import EventMap from '../components/maps/eventMap';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Routes } from '../components/customRoute';
import { useHistory } from 'react-router-dom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, Box } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { authFirebase, database } from '../firebase/config';

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
  event: EventWithId;
  joinEnabled: boolean;
  showEditDelete?: boolean;
  deleteClick?: (id: string) => void;
}

function EventCard(props: EventCardProps) {
  const history = useHistory();
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [registrated, setRegistrated] = useState(
    props.event.registrations &&
      authFirebase.currentUser &&
      props.event.registrations[authFirebase.currentUser.uid] &&
      true
  );

  const handleRegistration = () => {
    const user = authFirebase.currentUser;
    if (!user) return;
    const ref = database.ref(`events/${props.event.id}/registrations/${user.uid}`);
    registrated ? ref.remove() : ref.set({ email: user.email, added: Date.now() });
    setRegistrated(!registrated);
  };

  return (
    <Card className={classes.root}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} className={classes.mapGridItem}>
            <EventMap event={props.event} />
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography paragraph variant="h6">
              Treffpunkt bei {props.event.ort} um {props.event.zeit} Uhr
            </Typography>
            <p>
              <Badge
                color="primary"
                style={{ marginRight: '1em' }}
                badgeContent={Object.keys(props.event.registrations || {}).length || '0'}
              >
                <PersonIcon />
              </Badge>
              angemeldet
              <IconButton size="small" onClick={handleRegistration}>
                {registrated ? <RemoveCircleIcon /> : <AddCircleIcon />}
              </IconButton>
            </p>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                color="secondary"
                variant="contained"
                endIcon={<KeyboardArrowRightIcon />}
                disabled={!props.joinEnabled}
                onClick={() => history.push(Routes.cleanup.replace(':id', props.event.id))}
              >
                Teilnehmen
              </Button>
              {props.showEditDelete && (
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => history.push(Routes.editEvent.replace(':id', props.event.id))}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setShowDialog(true)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} style={{ zIndex: 3000 }}>
        <DialogTitle>Event löschen?</DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowDialog(false);
                props.deleteClick && props.deleteClick(props.event.id);
              }}
            >
              Löschen
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EventCard;
