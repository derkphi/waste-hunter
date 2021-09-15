import React, { useEffect, useState } from 'react';
import { GeolocateControl, Marker, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { authFirebase, database } from '../firebase/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import BasicMap, { MapViewport, defaultViewport } from '../components/maps/basicMap';
import distance from '@turf/distance';
import length from '@turf/length';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import firebase from 'firebase/app';

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
  iconStart: { transform: 'translate(-50%, -100%)' },
  iconUser: { color: 'rgba(66, 100, 251, .8)', transform: 'translate(-50%, -100%)' },
});

interface CleanupUser {
  uid: string;
  email: string | null;
  route?: { [key: string]: number[] }; // [longitude, latitude, timestamp]
}

interface Event {
  anlass: string;
  position: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export default function Cleanup() {
  const classes = useStyles();
  const history = useHistory();
  const [event, setEvent] = useState<Event>();
  const [viewport, setViewport] = useState<MapViewport>(event ? event.position : defaultViewport);
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>();
  const [position, setPosition] = useState<GeolocationPosition>();
  const [lastPosition, setLastPosition] = useState<GeolocationPosition>();
  const [showDialog, setShowDialog] = useState(false);
  const [collected, setCollected] = useState<number>();
  const { id } = useParams<{ id: string }>();
  const user = authFirebase.currentUser;

  useEffect(() => {
    database
      .ref(`events/${id}`)
      .get()
      .then((d) => setEvent(d.val()));
    const ref = database.ref(`cleanups/${id}`);
    const cb = (d: firebase.database.DataSnapshot) => setCleanupUsers(Object.values(d.val()));
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [id]);

  useEffect(() => {
    if (!user) return;
    database.ref(`cleanups/${id}/${user.uid}`).set({
      uid: user.uid,
      email: user.email,
    });
    setLastPosition(undefined);
  }, [user, id]);

  useEffect(() => {
    if (!user || !position) return;
    // push position max. all 10 seconds and 5 meters
    if (
      !lastPosition ||
      (Date.now() > lastPosition.timestamp + 10e3 &&
        distance(
          [position.coords.longitude, position.coords.latitude],
          [lastPosition.coords.longitude, lastPosition.coords.latitude]
        ) > 5e-3)
    ) {
      setLastPosition(position);
      database
        .ref(`cleanups/${id}/${user.uid}/route`)
        .push([position.coords.longitude, position.coords.latitude, position.timestamp]);
    }
  }, [user, id, position, lastPosition]);

  function getGeoJsonData(route: { [key: string]: number[] }): GeoJSON.Feature<GeoJSON.Geometry> {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: Object.values(route).map((p) => p.slice(0, 2)),
      },
    };
  }

  const handleDialogClose = () => {
    if (user) {
      const route = cleanupUsers?.find((u) => u.uid === user.uid)?.route;
      const distance = route ? length(getGeoJsonData(route)) : 0;
      database.ref(`cleanups/${id}/${user.uid}`).update({
        collected,
        distance,
      });
    }
    history.push('/');
  };

  function handleViewport(viewport: MapViewport) {
    setViewport(viewport);
  }

  return event ? (
    <main className={classes.main}>
      <BasicMap enableNavigation={true} viewport={viewport} onViewportChange={handleViewport}>
        <GeolocateControl
          style={{ right: 10, top: 10 }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          onGeolocate={(p: GeolocationPosition) => setPosition(p)}
          auto
        />

        {event && (
          <Marker longitude={event.position.longitude} latitude={event.position.latitude}>
            <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
          </Marker>
        )}

        {cleanupUsers?.map(
          (u) =>
            u.route && (
              <div key={u.uid}>
                <Source id={`source-${u.uid}`} type="geojson" data={getGeoJsonData(u.route)} />
                <Layer
                  id={`layer-${u.uid}`}
                  type="line"
                  source={`source-${u.uid}`}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                  }}
                  paint={{
                    'line-color': 'rgba(66, 100, 251, .4)',
                    'line-width': 6,
                  }}
                />
                {Object.values(u.route)
                  .slice(-1)
                  .map((r, i) => (
                    <Marker key={i} longitude={r[0]} latitude={r[1]}>
                      <PersonPinCircleIcon fontSize="large" className={classes.iconUser} />
                    </Marker>
                  ))}
              </div>
            )
        )}

        {/* {position && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {position.coords.longitude.toFixed(6)} / {position.coords.latitude.toFixed(6)} / {position.timestamp}
          </div>
        )} */}
      </BasicMap>

      <footer className={classes.footer}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setCollected(undefined);
            setShowDialog(true);
          }}
        >
          Beenden
        </Button>
      </footer>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} style={{ zIndex: 3000 }}>
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
          <Button color="secondary" onClick={() => setShowDialog(false)}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!(collected !== undefined && collected >= 0)}
            onClick={handleDialogClose}
          >
            Beenden
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  ) : null;
}
