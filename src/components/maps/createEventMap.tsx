import React, { useState, useEffect } from 'react';
import DynamicMap from './dynamicMap';
import { MapViewport } from './mapTypes';
import { getGeoJsonPolygon } from './geoJsonHelper';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { Popup } from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const markCursorStyle = 'crosshair';

const useStyles = makeStyles({
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

interface Coordinate {
  longitude: number;
  latitude: number;
}

interface CreateEventMapProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  useGeoLocation: boolean;
  onSearchAreaChange: (area: GeoJSON.Feature<GeoJSON.Geometry>) => void;
  onMeetingPointChange: (c: Coordinate | undefined) => void;
}

const CreateEventMap: React.FunctionComponent<CreateEventMapProps> = ({
  onViewportChange,
  viewport,
  useGeoLocation,
  onSearchAreaChange,
  onMeetingPointChange,
}) => {
  const classes = useStyles();
  const [ready, setReady] = useState(false);
  const [area, setArea] = useState<Array<[number, number]>>([]);
  const [next, setNext] = useState<[number, number] | undefined>();
  const [mark, setMark] = useState(false);
  const [meetingPointSet, setMeetingPointSet] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [meetingPoint, setMeetingPoint] = useState([viewport.longitude, viewport.latitude]);

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
      updateArea([]);
    } else {
      setNext(undefined);
    }
    setMark(!mark);
  }

  function handleDeleteButtonClick() {
    updateArea([]);
    setNext(undefined);
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

  function handleMapDoubleClick(longitude: number, latitude: number) {
    if (mark) {
      handleMapClick(longitude, latitude);
      handleMarkButtonClick();
    }
  }

  function handleMapMove(longitude: number, latitude: number) {
    if (mark) {
      setNext([longitude, latitude]);
    }
  }

  function updateArea(newArea: Array<[number, number]>) {
    setArea(newArea);
    onSearchAreaChange(getGeoJsonPolygon(newArea));
  }

  function handleMeetingPointButtonClick() {
    if (!meetingPointSet) {
      setShowPopup(true);
      setMeetingPoint([viewport.longitude, viewport.latitude]);
      onMeetingPointChange({ longitude: viewport.longitude, latitude: viewport.latitude });
    } else {
      onMeetingPointChange(undefined);
    }
    setMeetingPointSet(!meetingPointSet);
  }

  function handleMarkerDragStart() {
    setShowPopup(false);
  }

  function handleMarkerDragEnd(longitude: number, latitude: number) {
    setMeetingPoint([longitude, latitude]);
    onMeetingPointChange({ longitude: longitude, latitude: latitude });
  }

  function handleViewportChange(vp: MapViewport) {
    onViewportChange(vp);
    if (!meetingPointSet) {
      setMeetingPoint([vp.longitude, vp.latitude]);
    }
  }

  if (ready) {
    return (
      <Box className={`${classes.mapContainer} ${mark && classes.markActive}`}>
        <Box>
          Treffunkt:
          <Button
            onClick={handleMeetingPointButtonClick}
            className={`${classes.markButton} ${mark && classes.markActive}`}
            color="secondary"
            variant="contained"
            endIcon={meetingPointSet ? <DeleteForeverIcon /> : <LocationOnOutlinedIcon />}
          >
            {meetingPointSet ? 'löschen' : 'markieren'}
          </Button>
        </Box>
        <Box>
          Suchgebiet:
          <Button
            onClick={handleMarkButtonClick}
            className={`${classes.markButton} ${mark && classes.markActive}`}
            color="secondary"
            variant="contained"
            endIcon={<EditIcon />}
          >
            {mark ? 'Markieren beenden' : 'markieren'}
          </Button>
          <Button
            onClick={handleDeleteButtonClick}
            className={classes.markButton}
            color="secondary"
            variant="contained"
            endIcon={<DeleteForeverIcon />}
            disabled={area.length === 0}
          >
            Löschen
          </Button>
        </Box>
        <DynamicMap
          enableNavigation={true}
          viewport={viewport}
          onViewportChange={handleViewportChange}
          cursorOverride={markCursor}
          onClick={handleMapClick}
          onMove={handleMapMove}
          onDoubleClick={handleMapDoubleClick}
        >
          {area.length > 0 && <SearchArea data={getGeoJsonPolygon(next ? [...area, next] : area)} />}
          {meetingPointSet && (
            <>
              {showPopup && (
                <Popup longitude={meetingPoint[0]} latitude={meetingPoint[1]} offsetTop={-35} closeButton={false}>
                  Ziehe mich zum Treffpunkt
                </Popup>
              )}
              <MeetingPoint
                longitude={meetingPoint[0]}
                latitude={meetingPoint[1]}
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
