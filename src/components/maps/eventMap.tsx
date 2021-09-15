import React, { useState, useEffect } from 'react';
import BasicMap, { MapViewport } from './basicMap';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { makeStyles } from '@material-ui/core/styles';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

export const fallbackViewport: MapViewport = {
  latitude: 46.8131873,
  longitude: 8.22421,
  zoom: 6,
};

const useStyles = makeStyles({
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
});

interface EventMapProps {
  onViewportChange: (viewport: MapViewport) => void;
}

const EventMap: React.FunctionComponent<EventMapProps> = ({ onViewportChange }) => {
  const classes = useStyles();
  const [viewport, setViewport] = useState<MapViewport>(fallbackViewport);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onGeoPosUpdate, onPositionError, options);
    }
  }, []);

  function handleViewport(viewport: MapViewport) {
    setViewport(viewport);
    onViewportChange(viewport);
  }

  function onGeoPosUpdate(geoPos: GeolocationPosition) {
    setViewport({
      latitude: geoPos.coords.latitude,
      longitude: geoPos.coords.longitude,
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
      <BasicMap enableNavigation={true} viewport={viewport} onViewportChange={handleViewport}>
        <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
      </BasicMap>
    );
  } else {
    return <div>Karte wird geladen...</div>;
  }
};

export default EventMap;
