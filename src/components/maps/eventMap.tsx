import React, { useState, useEffect } from 'react';
import BasicMap, { MapViewport } from './basicMap';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { makeStyles } from '@material-ui/core/styles';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const useStyles = makeStyles({
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
});

interface EventMapProps {
  onViewportChange: (viewport: MapViewport) => void;
  viewport: MapViewport;
  useGeoLocation: boolean;
}

const EventMap: React.FunctionComponent<EventMapProps> = ({ onViewportChange, viewport, useGeoLocation }) => {
  const classes = useStyles();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && useGeoLocation && !ready) {
      navigator.geolocation.getCurrentPosition(
        (geoPos: GeolocationPosition) => {
          setReady(true);
          onViewportChange({
            latitude: geoPos.coords.latitude,
            longitude: geoPos.coords.longitude,
            zoom: 11,
          });
        },
        onPositionError,
        options
      );
    } else {
      setReady(true);
    }
  }, [useGeoLocation, onViewportChange, ready]);

  function onPositionError(err: GeolocationPositionError) {
    console.warn(`Event map position error(${err.code}): ${err.message}`);
    setReady(true);
  }

  if (ready) {
    return (
      <BasicMap enableNavigation={true} viewport={viewport} onViewportChange={onViewportChange}>
        <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
      </BasicMap>
    );
  } else {
    return <div>Karte wird geladen...</div>;
  }
};

export default EventMap;
