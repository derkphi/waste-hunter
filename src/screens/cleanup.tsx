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
  positions?: { [key: string]: CleanupPosition };
}

interface CleanupPosition {
  longitude: number;
  latitude: number;
  timestamp: number;
}

export default function Cleanup() {
  const history = useHistory();
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>([]);
  const [position, setPosition] = useState<CleanupPosition>();
  const [lastPosition, setLastPosition] = useState<CleanupPosition>();
  const user = authFirebase.currentUser;

  useEffect(() => {
    if (!user) return;
    database.ref(`cleanups/-eventid/${user.uid}`).set({
      uid: user.uid,
      email: user.email,
    });
  }, [user]);

  useEffect(() => {
    function getCleanups() {
      database
        .ref(`cleanups/-eventid`)
        .get()
        .then((d) => {
          if (d.exists()) setCleanupUsers(Object.values(d.val()));
        });
    }
    getCleanups();
    const interval = setInterval(getCleanups, 10e3);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('position', position, lastPosition);
    if (!user || !position) return;
    // push position max. all 10 seconds and 10 meters...
    if (
      !lastPosition ||
      (Date.now() > lastPosition.timestamp + 10e3 &&
        distance([position.longitude, position.latitude], [lastPosition.longitude, lastPosition.latitude]) > 5e-3)
    ) {
      setLastPosition(position);
      database.ref(`cleanups/-eventid/${user.uid}/positions`).push(position);
    }
  }, [user, position, lastPosition]);

  function handleGeolocate({ coords: { longitude, latitude }, timestamp }: GeolocationPosition) {
    setPosition({ longitude, latitude, timestamp });
  }

  function getGeoJsonData(positions: { [key: string]: CleanupPosition }): GeoJSON.Feature<GeoJSON.Geometry> {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: Object.values(positions).map((p) => [p.longitude, p.latitude]),
      },
    };
  }

  console.log('render', cleanupUsers);
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

        {cleanupUsers.map(
          (c) =>
            c.positions && (
              <div key={c.uid}>
                <Source id={`source-${c.uid}`} type="geojson" data={getGeoJsonData(c.positions)} />
                <Layer
                  id={`layer-${c.uid}`}
                  type="line"
                  source={`source-${c.uid}`}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                  }}
                  paint={{
                    'line-color': 'rgba(66, 100, 251, .5)',
                    'line-width': 6,
                  }}
                />
                {lastPosition && (
                  <Marker longitude={lastPosition.longitude} latitude={lastPosition.latitude}>
                    <MarkerIcon style={{ opacity: 0.8, transform: 'translate(-50%, -50%)' }} />
                  </Marker>
                )}
              </div>
            )
        )}

        {position && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {position.longitude.toFixed(6)} / {position.latitude.toFixed(6)} / {position.timestamp}
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
