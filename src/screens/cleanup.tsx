import React, { useEffect, useState } from 'react';
import ReactMapGL, { GeolocateControl, Marker, NavigationControl, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactComponent as MarkerIcon } from '../assets/mapbox-marker-icon-blue.svg';
import { authFirebase, database } from '../firebase/config';

interface CleanupUser {
  uid: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  email: string | null;
}

export default function Cleanup() {
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 46.82,
    longitude: 8.26,
    zoom: 7,
  });
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

  const handleViewport = (viewport: ViewportProps) => {
    setViewport(viewport);
  };

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
    <>
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoiZGVya3NlbnBoaWxpcHAiLCJhIjoiY2tycXV1ejZxMnFzNTJ1cnY5eHZ0ZXp1YSJ9.iWymYhi7VBjE_C6WIt0mOw"
        mapStyle="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
        {...viewport}
        onViewportChange={handleViewport}
        width="100%"
        height="100vh"
      >
        <NavigationControl style={{ left: 10, top: 10 }} />

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
      </ReactMapGL>
    </>
  );
}
