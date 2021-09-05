import React, { useEffect, useState } from 'react';
import { GeolocateControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactComponent as MarkerIcon } from '../assets/mapbox-marker-icon-blue.svg';
import { authFirebase, database } from '../firebase/config';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Map from '../components/map';

interface CleanupUser {
  uid: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  email: string | null;
}

export default function Cleanup() {
  const history = useHistory();
  const [myPosition, setMyPosition] = useState<GeolocationPosition>();
  const [cleanupUser, setCleanupUser] = useState<CleanupUser[]>([]);
  const [updated, setUpdated] = useState(0);

  const loadCleanupUser = () => {
    database
      .ref(`cleanups/-eventid`)
      .get()
      .then((snapshot) => {
        setCleanupUser(Object.values(snapshot.val()));
      });
  };

  useEffect(() => {
    loadCleanupUser();
    // momentan, alle 10s aktualisieren...
    const interval = setInterval(loadCleanupUser, 10e3);
    return () => clearInterval(interval);
  }, []);

  const handleGeolocate = (position: GeolocationPosition) => {
    setMyPosition(position);
    // momentan, max. alle 10s updaten...
    const user = authFirebase.currentUser;
    if (user && updated < Date.now() - 10e3) {
      setUpdated(Date.now());
      const cleanupUser: CleanupUser = {
        uid: user.uid,
        email: user.email,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
      };
      database.ref(`cleanups/-eventid/${user.uid}`).set(cleanupUser);
    }
  };

  // https://visgl.github.io/react-map-gl/docs

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000 }}>
      <Map enableNavigation={true}>

        <GeolocateControl
          style={{ right: 10, top: 10 }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
          auto
        />

        {cleanupUser
          .filter((u) => u.timestamp > Date.now() - 24 * 36e5)
          .map((u) => (
            <Marker key={u.uid} latitude={u.latitude} longitude={u.longitude}>
              <MarkerIcon style={{ opacity: 0.8, transform: 'translate(-50%, -50%)' }} />
            </Marker>
          ))}

        {myPosition && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {myPosition.coords.latitude.toFixed(6)} / {myPosition.coords.longitude.toFixed(6)}
          </div>
        )}
      </Map>

      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 10, textAlign: 'center' }}>
        <Button color="primary" variant="contained" onClick={() => history.push('/')}>
          Event verlassen
        </Button>
      </div>
    </div>
  );
}
