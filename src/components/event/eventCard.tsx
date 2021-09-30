import React, { useState } from 'react';
import { useMeasure } from 'react-use';
import { Card, CardHeader, CardContent, Badge, Typography, Button, IconButton, Box } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EventWithId } from '../../firebase/firebase_types';
import { Routes } from '../customRoute';
import { useHistory } from 'react-router-dom';
import EventMap from '../map/eventMap';
import { KeyboardArrowRight, DeleteForever, Edit, Person, AddCircle, RemoveCircle } from '@mui/icons-material';
import { auth, database } from '../../firebase/config';
import UserGroup from '../common/userGroup';

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginBottom: '20px',
  },
  content: {
    display: 'flex',
    gap: '20px',
  },
  map: {
    boxSizing: 'border-box',
    height: '325px',
  },
  info: {
    boxSizing: 'border-box',
  },
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
});

interface EventCardProps {
  event: EventWithId;
  joinEnabled: boolean;
  showEditDelete?: boolean;
  deleteClick?: (id: string) => void;
  hideUsers?: boolean;
}

function EventCard(props: EventCardProps) {
  const history = useHistory();
  const classes = useStyles();
  const [hidden, setHidden] = useState(false);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const [showDialog, setShowDialog] = useState(false);
  const [registrated, setRegistrated] = useState(
    props.event.registrations && auth.currentUser && props.event.registrations[auth.currentUser.uid] && true
  );

  const handleRegistration = () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = database.ref(`events/${props.event.id}/registrations/${user.uid}`);
    registrated ? ref.remove() : ref.set({ email: user.email, added: Date.now() });
    setRegistrated(!registrated);
  };

  return (
    <div ref={ref}>
      <Card className={classes.root}>
        <CardHeader
          title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass}
          onDoubleClick={() => setHidden(!hidden)}
        />
        <CardContent className={classes.content} style={{ flexDirection: width < 960 ? 'column' : 'row' }}>
          <Box className={classes.map} style={{ width: width < 960 ? '100%' : '50%' }}>
            <EventMap event={props.event} />
          </Box>
          <Box className={classes.info} style={{ width: width < 960 ? '100%' : '50%' }}>
            <Typography paragraph variant="h6">
              Treffpunkt bei {props.event.ort} um {props.event.zeit} Uhr
            </Typography>
            <p>
              <Badge
                color="primary"
                style={{ marginRight: '1em' }}
                badgeContent={Object.keys(props.event.registrations || {}).length || '0'}
              >
                <Person />
              </Badge>
              angemeldet
              <IconButton size="small" onClick={handleRegistration}>
                {registrated ? <RemoveCircle /> : <AddCircle />}
              </IconButton>
            </p>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                color="secondary"
                variant="contained"
                endIcon={<KeyboardArrowRight />}
                disabled={!props.joinEnabled}
                onClick={() => history.push(Routes.cleanup.replace(':id', props.event.id))}
              >
                Teilnehmen
              </Button>
              {props.showEditDelete && (
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (!hidden) {
                        history.push(Routes.editEvent.replace(':id', props.event.id));
                      } else {
                        history.push(Routes.hidden.replace(':id', props.event.id));
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => setShowDialog(true)}>
                    <DeleteForever />
                  </IconButton>
                </Box>
              )}
            </Box>
            {!props.hideUsers && props.event.registrations && Object.keys(props.event.registrations).length > 0 && (
              <>
                <Typography paragraph variant="h5" style={{ marginTop: '25px' }}>
                  Angemeldet:
                </Typography>
                <UserGroup userUids={Object.keys(props.event.registrations)} />
              </>
            )}
          </Box>
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
    </div>
  );
}

export default EventCard;
