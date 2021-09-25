import React from 'react';
import { StaticMap as FixedMap } from 'react-map-gl';
import { MapViewport } from './mapTypes';
import { apiAccessToken, mapStyle } from './config';
import 'mapbox-gl/dist/mapbox-gl.css';

interface StaticMapProps {
  viewport: MapViewport;
}

const StaticMap: React.FunctionComponent<StaticMapProps> = (props) => {
  return (
    <FixedMap mapboxApiAccessToken={apiAccessToken} mapStyle={mapStyle} {...props.viewport} width="100%" height="100%">
      {props.children}
    </FixedMap>
  );
};

export default StaticMap;
