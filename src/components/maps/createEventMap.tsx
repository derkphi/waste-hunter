import React, { useState, useEffect } from 'react';
import DynamicMap from './dynamicMap';
import { MapViewport } from './mapTypes';
import { getGeoJsonFromPolygon, getPolygonFromGeoJson } from './geoJsonHelper';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { Popup } from 'react-map-gl';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Box } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const markCursorStyle = 'crosshair';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    markActive: {
      cursor: markCursorStyle,
    },
    mapContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    iconButtonContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      position: 'absolute',
      zIndex: 2000,
      left: '45px',
      top: '6px',
    },
    iconButtonBox: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      background: 'white',
      borderRadius: '4px',
      margin: '4px',
      paddingLeft: '2px',
      boxShadow: '0 0 0 2px rgba(0,0,0,.1)',
    },
    iconLabel: {
      margin: '2px',
    },
    iconButton: {
      margin: '2px',
      background: 'white',
      border: '2px solid #cccccc',
      boxShadow: 'none',
      borderRadius: '4px',
    },
  })
);

interface Coordinate {
  longitude: number;
  latitude: number;
}

interface CreateEventMapProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  useGeoLocation: boolean;
  searchArea: GeoJSON.Feature<GeoJSON.Polygon> | undefined;
  onSearchAreaChange: (area: GeoJSON.Feature<GeoJSON.Polygon> | undefined) => void;
  meetingPoint: Coordinate | undefined;
  onMeetingPointChange: (c: Coordinate | undefined) => void;
  onDoubleClick: () => void;
}

const CreateEventMap: React.FunctionComponent<CreateEventMapProps> = ({
  onViewportChange,
  viewport,
  useGeoLocation,
  searchArea,
  onSearchAreaChange,
  meetingPoint,
  onMeetingPointChange,
  onDoubleClick,
}) => {
  const classes = useStyles();
  const [ready, setReady] = useState(false);
  const [next, setNext] = useState<[number, number] | undefined>();
  const [mark, setMark] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [area, setArea] = useState<Array<[number, number]>>(getPolygonFromGeoJson(searchArea));

  useEffect(() => {
    setArea(getPolygonFromGeoJson(searchArea));
  }, [searchArea]);

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
    if (!mark) {
      if (area.length > 0) {
        setArea([]);
        onSearchAreaChange(undefined);
      } else {
        setMark(true);
      }
    } else {
      setNext(undefined);
      setMark(false);
    }
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
      setArea(newArea);
      if (newArea.length > 0) {
        onSearchAreaChange(getGeoJsonFromPolygon(newArea));
      }
    }
  }

  function handleMapDoubleClick(longitude: number, latitude: number) {
    if (mark) {
      handleMapClick(longitude, latitude);
      handleMarkButtonClick();
    } else {
      onDoubleClick();
    }
  }

  function handleMapMove(longitude: number, latitude: number) {
    if (mark) {
      setNext([longitude, latitude]);
    }
  }

  function handleMeetingPointButtonClick() {
    if (meetingPoint === undefined) {
      setShowPopup(true);
      onMeetingPointChange({ longitude: viewport.longitude, latitude: viewport.latitude });
    } else {
      onMeetingPointChange(undefined);
    }
  }

  function handleMarkerDragStart() {
    setShowPopup(false);
  }

  function handleMarkerDragEnd(longitude: number, latitude: number) {
    onMeetingPointChange({ longitude: longitude, latitude: latitude });
  }

  if (ready) {
    return (
      <Box className={`${classes.mapContainer} ${mark && classes.markActive}`}>
        <Box className={classes.iconButtonContainer}>
          <Box className={classes.iconButtonBox}>
            <Typography className={classes.iconLabel}>Treffpunkt</Typography>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleMeetingPointButtonClick}
              className={`${classes.iconButton} ${mark && classes.markActive}`}
            >
              {meetingPoint ? <DeleteForeverIcon color="inherit" /> : <LocationOnOutlinedIcon />}
            </IconButton>
          </Box>
          <Box className={classes.iconButtonBox}>
            <Typography className={classes.iconLabel}>Suchgebiet</Typography>
            <IconButton
              size="small"
              onClick={handleMarkButtonClick}
              className={`${classes.iconButton} ${mark && classes.markActive}`}
              color="inherit"
            >
              {mark ? <DoneIcon /> : area.length > 0 ? <DeleteForeverIcon /> : <EditIcon />}
            </IconButton>
          </Box>
        </Box>
        <DynamicMap
          viewport={viewport}
          onViewportChange={onViewportChange}
          cursorOverride={markCursor}
          onClick={handleMapClick}
          onMove={handleMapMove}
          onDoubleClick={handleMapDoubleClick}
        >
          {area.length > 0 && <SearchArea data={getGeoJsonFromPolygon(next ? [...area, next] : area)} />}
          {meetingPoint && (
            <>
              {showPopup && (
                <Popup
                  longitude={meetingPoint.longitude}
                  latitude={meetingPoint.latitude}
                  offsetTop={-35}
                  closeButton={false}
                >
                  Ziehe mich zum Treffpunkt
                </Popup>
              )}
              <MeetingPoint
                longitude={meetingPoint.longitude}
                latitude={meetingPoint.latitude}
                onDragStart={handleMarkerDragStart}
                onDragEnd={handleMarkerDragEnd}
              />
            </>
          )}
        </DynamicMap>
      </Box>
    );
  } else {
    return <div>Karte wird geladen...</div>;
  }
};

export default CreateEventMap;
