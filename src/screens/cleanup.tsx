import React, { useEffect, useState } from 'react';
import { GeolocateControl, Marker, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactComponent as MarkerIcon } from '../assets/mapbox-marker-icon-blue.svg';
import { authFirebase, database } from '../firebase/config';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Map from '../components/map';
import distance from '@turf/distance';

interface CleanupUser {
  uid: string;
  email: string | null;
  route: number[][]; // [longitude, latitude, timestamp] //
}

export default function Cleanup() {
  const history = useHistory();
  const [myCleanup, setMyCleanup] = useState<CleanupUser>();
  const [allCleanups, setAllCleanups] = useState<CleanupUser[]>([]);

  const loadCleanupUser = () => {
    database
      .ref(`cleanups/-eventid`)
      .get()
      .then((ds) => {
        if (ds.exists()) setAllCleanups(Object.values(ds.val()));
      });
  };

  useEffect(() => {
    loadCleanupUser();
    // momentan, alle 10s aktualisieren...
    const interval = setInterval(loadCleanupUser, 10e3);
    return () => clearInterval(interval);
  }, []);

  const getGeoJsonData = (positions: number[][]): GeoJSON.Feature<GeoJSON.Geometry> => {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: positions.map((p) => [p[0], p[1]]),
      },
    };
  };

  const handleGeolocate = ({ coords: { longitude, latitude }, timestamp }: GeolocationPosition) => {
    const user = authFirebase.currentUser;
    if (!user) return;

    // update max. all 10 seconds and 10 meters
    const [lng, lat, time] = myCleanup?.route[0] || [0, 0, 0];
    if (time > Date.now() - 10e3 || distance([longitude, latitude], [lng, lat]) * 1e3 < 10) return;

    const cleanup: CleanupUser = {
      uid: user.uid,
      email: user.email,
      route: [[longitude, latitude, timestamp], ...(myCleanup?.route || [])],
    };
    setMyCleanup(cleanup);
    database.ref(`cleanups/-eventid/${user.uid}`).set(cleanup);
  };

  // https://visgl.github.io/react-map-gl/docs

  return (
    <div
      style={{ position: 'absolute', zIndex: 2000, top: 0, left: 0, width: '100%', height: '100%', background: '#FFF' }}
    >
      <Map enableNavigation={true}>
        <GeolocateControl
          style={{ right: 10, top: 10 }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
          auto
        />

        {allCleanups
          .filter((d) => d.route[0] && d.route[0][2] > Date.now() - 24 * 36e5)
          .map((d) => (
            <div key={d.uid}>
              <Source id={`source-${d.uid}`} type="geojson" data={getGeoJsonData(d.route)} />
              <Layer
                id={`layer-${d.uid}`}
                type="line"
                source={`source-${d.uid}`}
                paint={{
                  'line-color': 'rgba(66, 100, 251, .5)',
                  'line-width': 6,
                }}
              />
              {d.route[0] && (
                <Marker longitude={d.route[0][0]} latitude={d.route[0][1]}>
                  <MarkerIcon style={{ opacity: 0.8, transform: 'translate(-50%, -50%)' }} />
                </Marker>
              )}
            </div>
          ))}

        {myCleanup && myCleanup.route[0] && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {myCleanup.route[0][0].toFixed(6)} / {myCleanup.route[0][1].toFixed(6)} /{' '}
            {new Date(myCleanup.route[0][2]).toJSON()}
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
