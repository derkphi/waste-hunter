import React, { useState } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import logo from '../../assets/logo_transparent_background.png';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, makeStyles } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { CameraAltRounded } from '@material-ui/icons';
import SearchArea from './searchArea';
import WalkPath from './walkPath';
import MeetingPoint from './meetingPoint';
import { CleanupUser, EventWithId } from '../../firebase/types';
import { getGeoJsonLineFromRoute } from './geoJsonHelper';
import { apiAccessToken, mapStyle } from './config';
import { defaultViewport } from './dynamicMap';

const useStyles = makeStyles({
  logo: {
    position: 'absolute',
    left: '50%',
    top: 2,
    height: 45,
    transform: 'translateX(-50%)',
    userDrag: 'none',
    userSelect: 'none',
  },
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
});

interface CleanupMapProps {
  event: EventWithId;
  cleanups?: CleanupUser[];
  children?: React.ReactNode;
}

export default function CleanupMap({ event, cleanups = [], children }: CleanupMapProps) {
  const classes = useStyles();
  const [viewport, setViewport] = useState<ViewportProps>(event ? event.position : defaultViewport);
  const [showUser, setShowUser] = useState('');
  const [showPhoto, setShowPhoto] = useState('');

  return (
    <ReactMapGL
      mapboxApiAccessToken={apiAccessToken}
      mapStyle={mapStyle}
      {...viewport}
      onViewportChange={setViewport}
      width="100%"
      height="100%"
      touchRotate
      style={{ background: '#F9F9F9' }}
    >
      <NavigationControl style={{ left: 10, top: 10 }} />

      <img src={logo} alt="Waste Hunter" className={classes.logo} />

      {event.searchArea && <SearchArea data={event.searchArea} opacity={0.2} />}

      {event.meetingPoint && (
        <MeetingPoint longitude={event.meetingPoint.longitude} latitude={event.meetingPoint.latitude} />
      )}

      {cleanups?.map(
        ({ uid, route, email }) =>
          route && (
            <div key={uid}>
              <WalkPath
                uid={uid}
                walkPath={getGeoJsonLineFromRoute(route)}
                color={showUser === uid ? 'rgba(66, 100, 251, .8)' : 'rgba(66, 100, 251, .4)'}
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
                      className={`${classes.userMarker} ${
                        showUser === uid || time > Date.now() - 5 * 60e3 ? 'active' : 'inactive'
                      }`}
                    >
                      <LocationOnIcon fontSize="large" className={classes.userIcon} />
                      <div onClick={() => setShowUser(showUser === uid ? '' : uid)} className={classes.userCode}>
                        {email?.replace(/\W+/g, '').slice(0, 2)}
                      </div>
                    </Marker>

                    {showUser === uid && (
                      <Popup
                        longitude={lng}
                        latitude={lat}
                        closeButton={false}
                        closeOnClick={true}
                        onClose={() => setShowUser('')}
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

      {children}

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
    </ReactMapGL>
  );
}
