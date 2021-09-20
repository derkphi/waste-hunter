import React, { useState } from 'react';
import ReactMapGL, { NavigationControl, ViewportProps } from 'react-map-gl';
import { MapViewport } from './mapTypes';
import { apiAccessToken, mapStyle } from './config';
import 'mapbox-gl/dist/mapbox-gl.css';

export const defaultViewport: MapViewport = {
  latitude: 46.82,
  longitude: 8.26,
  zoom: 7,
};

interface BasicMapProps {
  viewport: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  cursorOverride?: () => string | undefined;
  onClick?: (longitude: number, latitude: number) => void;
  onDoubleClick?: (longitude: number, latitude: number) => void;
  onMove?: (longitude: number, latitude: number) => void;
}

const DynamicMap: React.FunctionComponent<BasicMapProps> = (props) => {
  const [mouseDown, setMouseDown] = useState(false);

  function handleViewport(viewport: ViewportProps) {
    if (props.onViewportChange) {
      if (viewport.longitude && viewport.latitude && viewport.zoom) {
        props.onViewportChange({ latitude: viewport.latitude, longitude: viewport.longitude, zoom: viewport.zoom });
      }
    }
  }

  function cursor() {
    const cursorParent = props.cursorOverride && props.cursorOverride();
    if (cursorParent) return cursorParent;
    return mouseDown ? 'grabbing' : 'grab';
  }

  return (
    <ReactMapGL
      mapboxApiAccessToken={apiAccessToken}
      mapStyle={mapStyle}
      {...props.viewport}
      onViewportChange={handleViewport}
      width="100%"
      height="100%"
      doubleClickZoom={false} //default true
      getCursor={cursor}
      onMouseDown={(e) => setMouseDown(true)}
      onMouseUp={(e) => setMouseDown(false)}
      onClick={(e) => props.onClick && props.onClick(e.lngLat[0], e.lngLat[1])}
      onMouseMove={(e) => props.onMove && props.onMove(e.lngLat[0], e.lngLat[1])}
      onDblClick={(e) => props.onDoubleClick && props.onDoubleClick(e.lngLat[0], e.lngLat[1])}
    >
      <NavigationControl style={{ left: 10, top: 10 }} />
      {props.children}
    </ReactMapGL>
  );
};

export default DynamicMap;
