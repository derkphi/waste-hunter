import React, { useEffect, useState } from 'react';
import ReactMapGL, {
  NavigationControl,
  GeolocateControl,
  Marker,
  Layer,
  Source,
  Popup,
  ViewportProps,
} from 'react-map-gl';
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
// import DynamicMap, { defaultViewport } from '../components/maps/dynamicMap';
import { defaultViewport } from '../components/maps/dynamicMap';
// import { MapViewport } from '../components/maps/mapTypes';
import { getGeoJsonLineFromRoute } from '../components/maps/geoJsonHelper';
import distance from '@turf/distance';
import length from '@turf/length';
// import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { CameraAltRounded } from '@material-ui/icons';
import firebase from 'firebase/app';
import DemoCleanups from '../components/demoCleanups';
import SearchArea from '../components/maps/searchArea';
import logo from '../assets/logo_transparent_background.png';
import Cameracomponent from '../components/camera/camera_component';
import SaveIcon from '@material-ui/icons/Save';
import { apiAccessToken, mapStyle } from '../components/maps/config';

const useStyles = makeStyles({
  header: { position: 'absolute', left: 0, top: 0, width: '100%', padding: 10, textAlign: 'center' },
  logo: { marginTop: -7, height: 44, userDrag: 'none', userSelect: 'none' },
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
  camera: { position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 10, textAlign: 'center' },
  iconStart: { transform: 'translate(-50%, -100%)' },
  userMarker: { opacity: 0.8, '&.inactive': { opacity: 0.4 } },
  userIcon: { color: 'rgb(66, 100, 251)' },
  userPopup: { '& .mapboxgl-popup-content': { padding: '5px 10px' } },
  userCode: {
    position: 'absolute',
    top: 8,
    left: '50%',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 10,
    lineHeight: 1,
    color: '#FFF',
    transform: 'translateX(-50%)',
    background: 'rgb(66, 100, 251)',
    cursor: 'pointer',
  },
  demoCleanups: { position: 'absolute', bottom: 25, right: 0 },
});

interface CleanupUser {
  uid: string;
  email: string | null;
  start: number;
  route?: { [key: string]: number[] }; // [longitude, latitude, timestamp]
  end?: number;
  collected?: number;
  distance?: number;
}

export interface Event {
  id: string;
  anlass: string;
  position: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  searchArea?: GeoJSON.Feature<GeoJSON.Geometry>;
}

export default function Cleanup() {
  const classes = useStyles();
  const history = useHistory();
  const [event, setEvent] = useState<Event>();
  const [viewport, setViewport] = useState<ViewportProps>(event?.position || defaultViewport);
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>();
  const [position, setPosition] = useState<GeolocationPosition>();
  const [lastPosition, setLastPosition] = useState<GeolocationPosition>();
  const [showPopup, setShowPopup] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [collected, setCollected] = useState<number>();
  const { id } = useParams<{ id: string }>();
  const user = authFirebase.currentUser;

  useEffect(() => {
    database
      .ref(`events/${id}`)
      .get()
      .then((d) => setEvent({ ...d.val(), id }));
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
      start: Date.now(),
    });
    setLastPosition(undefined);
  }, [user, id]);

  useEffect(() => {
    if (!user || !position || position.coords.accuracy > 100 || position.timestamp < Date.now() - 5 * 60e3) return;
    // push position max. all 5 seconds and 5 meters
    if (
      !lastPosition ||
      (Date.now() > lastPosition.timestamp + 5e3 &&
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

  const handleDialogClose = () => {
    const cleanup = cleanupUsers?.find((u) => u.uid === user?.uid);
    if (cleanup) {
      const distance = cleanup.route ? length(getGeoJsonLineFromRoute(cleanup.route)) : 0;
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

  if (!showCamera) {
    return event ? (
      <main className={classes.main} style={{ background: 'rgba(82, 135, 119, .1)' }}>
        <ReactMapGL
          mapboxApiAccessToken={apiAccessToken}
          mapStyle={mapStyle}
          {...viewport}
          onViewportChange={setViewport}
          width="100%"
          height="100%"
          touchRotate
        >
          <NavigationControl style={{ left: 10, top: 10 }} onViewportChange={setViewport} />

          <GeolocateControl
            style={{ right: 10, top: 10 }}
            positionOptions={{ enableHighAccuracy: true }}
            onGeolocate={(p: GeolocationPosition) => setPosition(p)}
            trackUserLocation={true}
            onViewportChange={setViewport}
            auto
          />

          {event.searchArea && <SearchArea data={event.searchArea} opacity={0.2} />}

          {event && (
            <Marker longitude={event.position.longitude} latitude={event.position.latitude}>
              <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
            </Marker>
          )}

          {cleanupUsers?.map(
            ({ uid, route, email }) =>
              route && (
                <div key={uid}>
                  <Source id={`source-${uid}`} type="geojson" data={getGeoJsonLineFromRoute(route)} />
                  <Layer
                    id={`layer-${uid}`}
                    type="line"
                    source={`source-${uid}`}
                    layout={{
                      'line-cap': 'round',
                      'line-join': 'round',
                    }}
                    paint={{
                      'line-color': 'rgba(66, 100, 251, .4)',
                      'line-width': 6,
                    }}
                  />
                  {Object.values(route)
                    .slice(-1)
                    .map(([lng, lat, time]) => (
                      <>
                        <Marker
                          key={time}
                          longitude={lng}
                          latitude={lat}
                          offsetTop={-32}
                          offsetLeft={-17.5}
                          className={`${classes.userMarker} ${time > Date.now() - 5 * 60e3 ? 'active' : 'inactive'}`}
                        >
                          <LocationOnIcon fontSize="large" className={classes.userIcon} />
                          <div onClick={() => setShowPopup(showPopup === uid ? '' : uid)} className={classes.userCode}>
                            {email?.replace(/\W+/g, '').slice(0, 2)}
                          </div>
                        </Marker>
                        {showPopup === uid && (
                          <Popup
                            longitude={lng}
                            latitude={lat}
                            closeButton={false}
                            closeOnClick={true}
                            onClose={() => setShowPopup('')}
                            anchor="bottom"
                            offsetTop={-25}
                            className={classes.userPopup}
                          >
                            {email
                              ?.replace(/@.*/g, '')
                              .replace(/[._]+/g, ' ')
                              .replace(/((^|\s)\S)/g, (m) => m.toUpperCase())}
                          </Popup>
                        )}
                      </>
                    ))}
                </div>
              )
          )}

          {/* {position && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {position.coords.longitude.toFixed(6)} / {position.coords.latitude.toFixed(6)} / {position.coords.accuracy}{' '}
            / {position.timestamp}
          </div>
        )} */}
        </ReactMapGL>

        <header className={classes.header}>
          <img src={logo} alt="Waste Hunter" className={classes.logo} />
        </header>

        <footer className={classes.footer}>
          <Button
            color="secondary"
            variant="contained"
            endIcon={<CameraAltRounded />}
            onClick={() => {
              setShowCamera(true);
            }}
          >
            Markieren
          </Button>

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

        <DemoCleanups className={classes.demoCleanups} event={event} />
      </main>
    ) : null;
  } else {
    return event ? (
      <main className={classes.main} style={{ background: 'rgba(82, 135, 119, .1)' }}>
        <Cameracomponent />

        <footer className={classes.camera}>
          <Button
            color="primary"
            variant="contained"
            endIcon={<SaveIcon />}
            onClick={() => {
              setShowCamera(false);
            }}
          >
            Speichern
          </Button>
        </footer>
      </main>
    ) : null;
  }
}
