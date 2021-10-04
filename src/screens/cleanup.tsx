import React, { useEffect, useState } from 'react';
import { GeolocateControl } from 'react-map-gl';
import { authFirebase, database } from '../firebase/config';
import { makeStyles, Button, TextField } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { getCleanupRouteDistance, getGeoPositionDistance } from '../components/map/geoJsonHelper';
import { CameraAltRounded } from '@material-ui/icons';
import firebase from 'firebase/app';
import { CleanupUser, EventWithId } from '../firebase/types';
import DemoCleanups from '../components/demoCleanups';
import PhotoCamera from '../components/camera/photoCamera';
import CleanupMap from '../components/map/cleanupMap';

const useStyles = makeStyles({
  main: {
    position: 'absolute',
    zIndex: 2000,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#FFF',
  },
  footer: { position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 10, textAlign: 'center' },
  demoCleanups: { position: 'absolute', bottom: 25, right: 0 },
});

export default function Cleanup() {
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const history = useHistory();
  const [event, setEvent] = useState<EventWithId>();
  const [cleanups, setCleanups] = useState<CleanupUser[]>();
  const [position, setPosition] = useState<GeolocationPosition>();
  const [lastPosition, setLastPosition] = useState<GeolocationPosition>();
  const [showClose, setShowClose] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [collected, setCollected] = useState<number>();
  const user = authFirebase.currentUser;

  useEffect(() => {
    const eventRef = database.ref(`events/${id}`);
    const eventCb = (d: firebase.database.DataSnapshot) => setEvent({ ...d.val(), id });
    eventRef.on('value', eventCb);

    const cleanupRef = database.ref(`cleanups/${id}`);
    const cleanupCb = (d: firebase.database.DataSnapshot) => setCleanups(Object.values(d.val()));
    cleanupRef.on('value', cleanupCb);

    return () => {
      eventRef.off('value', eventCb);
      cleanupRef.off('value', cleanupCb);
    };
  }, [id]);

  useEffect(() => {
    if (!user) return;
    database.ref(`cleanups/${id}/${user.uid}`).set({
      uid: user.uid,
      email: user.email,
      start: Date.now(),
    });
    setLastPosition(undefined);
  }, [user, id]);

  useEffect(() => {
    if (!user || !position || position.coords.accuracy > 100 || position.timestamp < Date.now() - 5 * 60e3) return;
    // push position max. all 5 seconds and 5 meters
    if (
      !lastPosition ||
      (Date.now() > lastPosition.timestamp + 5e3 && getGeoPositionDistance(position, lastPosition) > 5e-3)
    ) {
      setLastPosition(position);
      database
        .ref(`cleanups/${id}/${user.uid}/route`)
        .push([position.coords.longitude, position.coords.latitude, position.timestamp]);
    }
  }, [user, id, position, lastPosition]);

  const handleClose = () => {
    const cleanup = cleanups?.find((u) => u.uid === user?.uid);
    if (cleanup) {
      const distance = getCleanupRouteDistance(cleanup.route);
      database.ref(`cleanups/${id}/${cleanup.uid}`).update({
        end: Date.now(),
        distance,
        collected,
      });
      database.ref(`events/${id}/cleanup/${cleanup.uid}`).set({
        uid: cleanup.uid,
        email: cleanup.email,
        start: cleanup.start,
        end: Date.now(),
        distance,
        collected,
      });
    }
    history.push('/');
  };

  return event ? (
    showCamera ? (
      <PhotoCamera eventId={event.id} onClose={() => setShowCamera(false)} />
    ) : (
      <main className={classes.main} style={{ background: 'rgba(82, 135, 119, .1)' }}>
        <CleanupMap event={event} cleanups={cleanups}>
          <GeolocateControl
            style={{ right: 10, top: 10 }}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onGeolocate={(p: GeolocationPosition) => setPosition(p)}
            auto
          />

          {/* {position && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {position.coords.longitude.toFixed(6)} / {position.coords.latitude.toFixed(6)} / {position.coords.accuracy}{' '}
            / {position.timestamp}
          </div>
        )} */}
        </CleanupMap>

        <footer className={classes.footer}>
          <Button
            color="secondary"
            variant="contained"
            endIcon={<CameraAltRounded />}
            onClick={() => {
              setShowCamera(true);
            }}
            style={{ marginRight: 10 }}
          >
            Markieren
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setCollected(undefined);
              setShowClose(true);
            }}
          >
            Beenden
          </Button>
        </footer>

        <Dialog open={showClose} onClose={() => setShowClose(false)} style={{ zIndex: 3000 }}>
          <DialogTitle>Event beenden</DialogTitle>
          <DialogContent>
            <DialogContentText>Vielen Dank für die Teilnahme beim "{event.anlass}" Event.</DialogContentText>
            <DialogContentText>
              Bitte geben sie zum beenden des Events noch die Menge ihres gesammelten Abfalles ein.
            </DialogContentText>
            <TextField
              id="collected-waste"
              label="Abfall (in Liter)"
              type="number"
              onChange={(e) => setCollected(Number(e.target.value))}
              autoComplete="off"
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => setShowClose(false)}>
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!(collected !== undefined && collected >= 0)}
              onClick={handleClose}
            >
              Beenden
            </Button>
          </DialogActions>
        </Dialog>

        <DemoCleanups className={classes.demoCleanups} event={event} />
      </main>
    )
  ) : null;
}
