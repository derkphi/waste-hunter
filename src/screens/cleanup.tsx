import React, { useEffect, useState } from 'react';
import ReactMapGL, { GeolocateControl, Marker, NavigationControl, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactComponent as MarkerIcon } from '../assets/mapbox-marker-icon-blue.svg';
import firebase from 'firebase';

export default function Cleanup() {
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 47,
    longitude: 8,
    zoom: 14,
  });
  const [myPosition, setMyPosition] = useState<{ lat: number; long: number }>();
  const [members] = useState([
    { name: 'Hans', lat: 47.163, long: 8.114 },
    { name: 'Peter', lat: 47.164, long: 8.113 },
    { name: 'Ueli', lat: 47.162, long: 8.116 },
  ]);

  // useEffect(() => {
  //   var db = firebase.database();

  //   db.ref('users/regr').set({
  //     username: 'regr',
  //     name: 'Reto',
  //   }).then();
  // }, []);

  const handleViewportChange = (nextViewport: ViewportProps) => {
    // console.log(nextViewport);
    setViewport(nextViewport);
  };

  const handleGeolocate = (position: GeolocationPosition) => {
    // console.log(position.coords);
    setMyPosition({ lat: position.coords.latitude, long: position.coords.longitude });
  };

  // https://visgl.github.io/react-map-gl/docs

  return (
    <>
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoiZGVya3NlbnBoaWxpcHAiLCJhIjoiY2tycXV1ejZxMnFzNTJ1cnY5eHZ0ZXp1YSJ9.iWymYhi7VBjE_C6WIt0mOw"
        mapStyle="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
        {...viewport}
        onViewportChange={handleViewportChange}
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

        {members.map((m) => (
          <Marker key={m.name} latitude={m.lat} longitude={m.long}>
            <MarkerIcon style={{ opacity: 0.8, transform: 'translate(-50%, -50%)' }} />
          </Marker>
        ))}

        {myPosition && (
          <div style={{ position: 'absolute', top: 10, right: 50 }}>
            {myPosition.lat.toFixed(6)} / {myPosition.long.toFixed(6)}
          </div>
        )}
      </ReactMapGL>
    </>
  );
}
