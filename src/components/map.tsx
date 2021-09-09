import React, { useState } from 'react';
import ReactMapGL, { NavigationControl, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@material-ui/core';

export interface MapPosition {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface MapProps {
  initialPosition?: MapPosition;
  enableNavigation?: boolean;
  onPositionChange?: (pos: MapPosition) => void;
}

export const defaultPosition: MapPosition = {
  latitude: 46.82,
  longitude: 8.26,
  zoom: 7,
};

const Map: React.FunctionComponent<MapProps> = (props) => {
  const [viewport, setViewport] = useState<ViewportProps>(props.initialPosition ?? defaultPosition);
  const [position, setPosition] = useState<ViewportProps>(viewport);
  const enableNavigation = props.enableNavigation ?? false;

  function handleViewport(viewport: ViewportProps) {
    if (viewport.longitude && viewport.latitude && viewport.zoom) {
      setViewport(viewport);
    }
  }

  function checkPosition() {
    if (viewport.longitude && viewport.latitude && viewport.zoom) {
      if (viewport !== position) {
        setPosition(viewport);
        props.onPositionChange &&
          props.onPositionChange({
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            zoom: viewport.zoom,
          });
      }
    }
  }

  return (
    <Box
      width="100%"
      height="100%"
      onClick={enableNavigation ? checkPosition : undefined}
      onKeyUp={enableNavigation ? checkPosition : undefined}
    >
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoiZGVya3NlbnBoaWxpcHAiLCJhIjoiY2tycXV1ejZxMnFzNTJ1cnY5eHZ0ZXp1YSJ9.iWymYhi7VBjE_C6WIt0mOw"
        mapStyle="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
        {...viewport}
        onViewportChange={enableNavigation ? handleViewport : undefined}
        width="100%"
        height="100%"
        // onMouseUp={(e) => console.log("Mouse:", e.lngLat)}
      >
        {enableNavigation && <NavigationControl style={{ left: 10, top: 10 }} />}
        {props.children}
      </ReactMapGL>
    </Box>
  );
};

export default Map;
