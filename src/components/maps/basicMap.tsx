import React, { useState } from 'react';
import ReactMapGL, { NavigationControl, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export const defaultViewport: MapViewport = {
  latitude: 46.82,
  longitude: 8.26,
  zoom: 7,
};

interface BasicMapProps {
  viewport: MapViewport;
  enableNavigation?: boolean;
  onViewportChange?: (viewport: MapViewport) => void;
}

const BasicMap: React.FunctionComponent<BasicMapProps> = (props) => {
  const [mouseDown, setMouseDown] = useState(false);
  const enableNavigation = props.enableNavigation ?? false;

  function handleViewport(viewport: ViewportProps) {
    if (props.onViewportChange) {
      if (viewport.longitude && viewport.latitude && viewport.zoom) {
        props.onViewportChange({ latitude: viewport.latitude, longitude: viewport.longitude, zoom: viewport.zoom });
      }
    }
  }

  function cursor() {
    return enableNavigation ? (mouseDown ? 'grabbing' : 'grab') : 'default';
  }

  return (
    <ReactMapGL
      mapboxApiAccessToken="pk.eyJ1IjoiZGVya3NlbnBoaWxpcHAiLCJhIjoiY2tycXV1ejZxMnFzNTJ1cnY5eHZ0ZXp1YSJ9.iWymYhi7VBjE_C6WIt0mOw"
      mapStyle="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
      {...props.viewport}
      onViewportChange={enableNavigation ? handleViewport : undefined}
      width="100%"
      height="100%"
      scrollZoom={enableNavigation}
      dragPan={enableNavigation}
      dragRotate={enableNavigation}
      doubleClickZoom={enableNavigation}
      touchZoom={enableNavigation}
      touchRotate={false}
      keyboard={enableNavigation}
      touchAction={enableNavigation ? 'none' : 'pan-y'}
      getCursor={cursor}
      onMouseDown={(e) => setMouseDown(true)}
      onMouseUp={(e) => setMouseDown(false)}
      //onClick={(e) => console.log('Mouse:', e.lngLat)}
      // onMouseUp={(e) => console.log("Mouse:", e.lngLat)}
    >
      <NavigationControl
        style={{ left: 10, top: 10 }}
        showCompass={enableNavigation}
        showZoom={enableNavigation}
        captureScroll={false}
        captureDrag={enableNavigation}
        captureClick={enableNavigation}
        captureDoubleClick={enableNavigation}
        capturePointerMove={false}
      />
      {props.children}
    </ReactMapGL>
  );
};

export default BasicMap;
