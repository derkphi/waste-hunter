import React, { useEffect, useState } from 'react';
import { GeolocateControl, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { auth, database, DataSnapshot } from '../firebase/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory, useParams } from 'react-router-dom';
import DynamicMap, { defaultViewport } from '../components/map/dynamicMap';
import { MapViewport } from '../components/map/mapTypes';
import { getGeoJsonLineFromRoute } from '../components/map/geoJsonHelper';
import distance from '@turf/distance';
import length from '@turf/length';
// import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { LocationOn, CameraAltRounded } from '@mui/icons-material';
import { CleanupUser } from '../firebase/firebase_types';
import DemoCleanups from '../components/demoCleanups';
import SearchArea from '../components/map/searchArea';
import logo from '../assets/logo_transparent_background.png';
import Cameracomponent from '../components/camera/camera_component';
import WalkPath from '../components/map/walkPath';

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
  iconStart: { transform: 'translate(-50%, -100%)' },
  iconPhoto: { transform: 'translate(-75%, -75%)', cursor: 'pointer', color: 'rgb(222, 150, 27)' },
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

export interface Event {
  id: string;
  anlass: string;
  position: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  searchArea?: GeoJSON.Feature<GeoJSON.Geometry>;
  photos?: { [id: string]: { url: string; longitude?: number; latitude?: number } };
}

export default function Cleanup() {
  const classes = useStyles();
  const history = useHistory();
  const [event, setEvent] = useState<Event>();
  const [viewport, setViewport] = useState<MapViewport>(event ? event.position : defaultViewport);
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>();
  const [position, setPosition] = useState<GeolocationPosition>();
  const [lastPosition, setLastPosition] = useState<GeolocationPosition>();
  const [showPopup, setShowPopup] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhoto, setShowPhoto] = useState('');
  const [collected, setCollected] = useState<number>();
  const { id } = useParams<{ id: string }>();
  const user = auth.currentUser;

  useEffect(() => {
    database
      .ref(`events/${id}`)
      .get()
      .then((d) => setEvent({ ...d.val(), id }));
    const ref = database.ref(`cleanups/${id}`);
    const cb = (d: DataSnapshot) => setCleanupUsers(Object.values(d.val()));
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

  function handleViewport(viewport: MapViewport) {
    setViewport(viewport);
  }

  // if (!showCamera) {
  //   <Cameracomponent />

  return event ? (
    showCamera ? (
      <Cameracomponent eventId={event.id} onClose={() => setShowCamera(false)} />
    ) : (
      <main className={classes.main} style={{ background: 'rgba(82, 135, 119, .1)' }}>
        <DynamicMap viewport={viewport} onViewportChange={handleViewport}>
          <GeolocateControl
            style={{ right: 10, top: 10 }}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onGeolocate={(p: GeolocationPosition) => setPosition(p)}
            auto
          />

          {event.searchArea && <SearchArea data={event.searchArea} opacity={0.2} />}

          <Marker longitude={event.position.longitude} latitude={event.position.latitude}>
            <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
          </Marker>

          {event.photos &&
            Object.values(event.photos).map((photo, i) => (
              <>
                {photo.longitude && photo.latitude && (
                  <Marker key={i} longitude={photo.longitude} latitude={photo.latitude}>
                    <CameraAltRounded
                      fontSize="large"
                      className={classes.iconPhoto}
                      onClick={() => setShowPhoto(photo.url)}
                    />
                  </Marker>
                )}
              </>
            ))}

          {cleanupUsers?.map(
            ({ uid, route, email }) =>
              route && (
                <div key={uid}>
                  <WalkPath uid={uid} walkPath={getGeoJsonLineFromRoute(route)} />
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
                          <LocationOn fontSize="large" className={classes.userIcon} />
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
        </DynamicMap>

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

        <Dialog open={!!showPhoto} onClose={() => setShowPhoto('')} style={{ zIndex: 3000 }}>
          <DialogContent>
            <DialogContentText>
              <img src={showPhoto} alt="" width="95%" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => setShowPhoto('')}>
              Abbrechen
            </Button>
          </DialogActions>
        </Dialog>

        <DemoCleanups className={classes.demoCleanups} event={event} />
      </main>
    )
  ) : null;
}
