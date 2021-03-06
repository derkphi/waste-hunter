import React, { useState } from 'react';
import { useMeasure } from 'react-use';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { EventWithId } from '../../firebase/types';
import EventMap from '../map/eventMap';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Routes } from '../customRoute';
import { useHistory } from 'react-router-dom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, Box } from '@material-ui/core';

import { authFirebase, database } from '../../firebase/config';
import UserGroup from '../common/userGroup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [hidden, setHidden] = useState(false);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
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
                    onClick={() => {
                      if (!hidden) {
                        history.push(Routes.editEvent.replace(':id', props.event.id));
                      } else {
                        history.push(Routes.hidden.replace(':id', props.event.id));
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setShowDialog(true)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {props.event.registrations && Object.keys(props.event.registrations).length > 0 && (
              <>
                <Typography paragraph variant="h5" style={{ marginTop: '25px' }}>
                  Angemeldet:
                </Typography>
                <UserGroup userUids={Object.keys(props.event.registrations)} />
              </>
            )}

            <Box style={{ marginTop: 10 }}>
              <Button color="secondary" variant="contained" onClick={handleRegistration}>
                {registrated ? 'abmelden' : 'anmelden'}
              </Button>
            </Box>
          </Box>
        </CardContent>

        <Dialog open={showDialog} onClose={() => setShowDialog(false)} style={{ zIndex: 3000 }}>
          <DialogTitle>Event l??schen?</DialogTitle>
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
                L??schen
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

export default EventCard;
