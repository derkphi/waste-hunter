import React, { useState, useEffect } from 'react';
import BasicMap, { MapViewport } from './basicMap';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const markCursorStyle = 'crosshair';

function getGeoJsonData(points: Array<[number, number]>): GeoJSON.Feature<GeoJSON.Geometry> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [points],
    },
  };
}

const useStyles = makeStyles({
  iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  markActive: {
    cursor: markCursorStyle,
  },
  markButton: {
    margin: '5px',
  },
});

interface EventMapProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  useGeoLocation: boolean;
  onSearchAreaChange: (area: GeoJSON.Feature<GeoJSON.Geometry>) => void;
}

const EventMap: React.FunctionComponent<EventMapProps> = ({
  onViewportChange,
  viewport,
  useGeoLocation,
  onSearchAreaChange,
  children,
}) => {
  const classes = useStyles();
  const [ready, setReady] = useState(false);
  const [area, setArea] = useState<Array<[number, number]>>([]);
  const [mark, setMark] = useState(false);

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

  function handleMarkButtonClick() {
    if (!mark) updateArea([]);
    setMark(!mark);
  }

  function handleDeleteButtonClick() {
    updateArea([]);
  }

  function markCursor() {
    if (mark) {
      return markCursorStyle;
    }
    return undefined;
  }

  function handleMapClick(longitude: number, latitude: number) {
    if (mark) {
      const newArea: Array<[number, number]> = [...area, [longitude, latitude]];
      updateArea(newArea);
    }
  }

  function updateArea(newArea: Array<[number, number]>) {
    setArea(newArea);
    onSearchAreaChange(getGeoJsonData(newArea));
  }

  if (ready) {
    return (
      <Box className={`${classes.mapContainer} ${mark && classes.markActive}`}>
        <Button
          onClick={handleMarkButtonClick}
          className={`${classes.markButton} ${mark && classes.markActive}`}
          color="secondary"
          variant="contained"
          endIcon={<EditIcon />}
        >
          {mark ? 'Markieren beenden' : 'Suchgebiet markieren'}
        </Button>
        <Button
          onClick={handleDeleteButtonClick}
          className={classes.markButton}
          color="secondary"
          variant="contained"
          endIcon={<DeleteForeverIcon />}
        >
          Suchgebiet Löschen
        </Button>
        <BasicMap
          enableNavigation={true}
          viewport={viewport}
          onViewportChange={onViewportChange}
          cursorOverride={markCursor}
          onClick={handleMapClick}
        >
          {children}
          <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
        </BasicMap>
      </Box>
    );
  } else {
    return <div>Karte wird geladen...</div>;
  }
};

export default EventMap;
