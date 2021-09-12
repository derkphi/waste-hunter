import React, { useState, useEffect } from 'react';
import Map, { MapPosition, defaultPosition } from './map';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { makeStyles } from '@material-ui/core/styles';

export const defaultPos = defaultPosition;

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const fallbackPosition = {
  latitude: 46.8131873,
  longitude: 8.22421,
  zoom: 6,
};

const useStyles = makeStyles({
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
});

interface EventMapProps {
  onNewPosition?: (pos: MapPosition) => void;
}

function EventMap(props: EventMapProps) {
  const classes = useStyles();
  const [ready, setReady] = useState(false);
  const [position, setPosition] = useState(fallbackPosition);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionUpdate, onPositionError, options);
    }
  }, []);

  function onPositionUpdate(position: GeolocationPosition) {
    setPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      zoom: 11,
    });
    setReady(true);
  }

  function onPositionError(err: GeolocationPositionError) {
    console.warn(`Event map position error(${err.code}): ${err.message}`);
    setReady(true);
  }

  if (ready) {
    return (
      <Map initialPosition={position} enableNavigation={true} onPositionChange={props.onNewPosition}>
        <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
      </Map>
    );
  } else {
    return <div>Karte wird geladen...</div>;
  }
}

export default EventMap;
