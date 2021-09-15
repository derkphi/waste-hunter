import ReactMapGL, { NavigationControl, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface BasicMapProps {
  viewport?: MapViewport;
  enableNavigation?: boolean;
  onViewportChange?: (viewport: MapViewport) => void;
}

const BasicMap: React.FunctionComponent<BasicMapProps> = (props) => {
  const enableNavigation = props.enableNavigation ?? false;

  function handleViewport(viewport: ViewportProps) {
    if (props.onViewportChange) {
      if (viewport.longitude && viewport.latitude && viewport.zoom) {
        props.onViewportChange({ latitude: viewport.latitude, longitude: viewport.longitude, zoom: viewport.zoom });
      }
    }
  }

  return (
    <ReactMapGL
      mapboxApiAccessToken="pk.eyJ1IjoiZGVya3NlbnBoaWxpcHAiLCJhIjoiY2tycXV1ejZxMnFzNTJ1cnY5eHZ0ZXp1YSJ9.iWymYhi7VBjE_C6WIt0mOw"
      mapStyle="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
      {...props.viewport}
      onViewportChange={enableNavigation ? handleViewport : undefined}
      width="100%"
      height="100%"
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      doubleClickZoom={false}
      touchZoom={false}
      touchRotate={false}
      keyboard={false}
      touchAction={'pan-y'}
      getCursor={() => 'default'}
      // onMouseUp={(e) => console.log("Mouse:", e.lngLat)}
    >
      <NavigationControl
        style={{ left: 10, top: 10 }}
        showCompass={false}
        showZoom={false}
        captureScroll={false}
        captureDrag={false}
        captureClick={false}
        captureDoubleClick={false}
        capturePointerMove={false}
      />
      {props.children}
    </ReactMapGL>
  );
};

export default BasicMap;
