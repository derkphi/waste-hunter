import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DynamicMap from '../components/maps/dynamicMap';
import SearchArea from '../components/maps/searchArea';
import { getGeoJsonLine } from '../components/maps/geoJsonHelper';
import { Layer, Source } from 'react-map-gl';
import { database } from '../firebase/config';
import { Box, Typography } from '@material-ui/core';
import distance from '@turf/distance';
import length from '@turf/length';
import StatisticItem from '../components/report/statisticItem';

const fallbackViewport = {
  latitude: 46.8131873,
  longitude: 8.22421,
  zoom: 7,
};

const sourceId = 0;
const walkSpeed = 5; // [km/h]

function GenData() {
  const [searchArea, setSearchArea] = useState<GeoJSON.Feature<GeoJSON.Polygon> | undefined>(undefined);
  const [viewport, setViewport] = useState(fallbackViewport);
  const [draw, setDraw] = useState(false);
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [walkDist, setWalkDist] = useState(0);
  const [walkTime, setWalkTime] = useState(0);
  //const [sourceId, setSourceId] = useState(0);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      database
        .ref(`events/${id}`)
        .get()
        .then((d) => {
          setViewport(d.val().position);
          setSearchArea(d.val().searchArea);
        });
    }
  }, [id]);

  useEffect(() => {
    setWalkDist(Math.round(1000 * length(getGeoJsonLine(route))));
  }, [route]);

  useEffect(() => {
    setWalkTime(Math.round(walkDist / (walkSpeed / 3.6) / 60));
  }, [walkDist]);

  function handleMapDoubleClick(longitude: number, latitude: number) {
    if (!draw) {
      //setSourceId(sourceId + 1);
      setRoute([[longitude, latitude]]);
    }
    setDraw(!draw);
  }

  function handleMapClick(_longitude: number, _latitude: number) {
    setDraw(!draw);
  }

  function handleMapMove(longitude: number, latitude: number) {
    if (draw) {
      if (route.length > 0) {
        if (distance([longitude, latitude], route[route.length - 1]) > 5e-3) {
          console.log(longitude + '/' + latitude);
          setRoute([...route, [longitude, latitude]]);
        }
      } else {
        setRoute([[longitude, latitude]]);
      }
    }
  }

  function drawCursor() {
    if (draw) {
      return 'crosshair';
    }
    return undefined;
  }

  return (
    <Box style={{ width: '100%', height: '70vh' }}>
      <Typography paragraph>
        Doppelklick: Linie zeichnen starten / beenden. Klick: Linie zeichnen unterbrechen (z.B. für Karte schieben und
        zoomen)
      </Typography>
      <DynamicMap
        viewport={viewport}
        onDoubleClick={handleMapDoubleClick}
        onClick={handleMapClick}
        onMove={handleMapMove}
        onViewportChange={(vp) => setViewport(vp)}
        cursorOverride={drawCursor}
      >
        {searchArea && <SearchArea data={searchArea} />}
        {route.length > 1 && (
          <>
            <Source id={`source-${sourceId}`} type="geojson" data={getGeoJsonLine(route)} />
            <Layer
              id="layer-id"
              type="line"
              source={`source-${sourceId}`}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
              paint={{
                'line-color': 'rgba(66, 100, 251, .4)',
                'line-width': 6,
              }}
            />
          </>
        )}
      </DynamicMap>
      <Box style={{ display: 'flex' }}>
        <StatisticItem label={'Suchzeit'} value={walkTime} unit={'Min.'} color="#f7eeb3" />
        <StatisticItem label={'Strecke'} value={walkDist} unit={'Meter'} color="#bbdeeb" />
      </Box>
    </Box>
  );
}

export default GenData;
