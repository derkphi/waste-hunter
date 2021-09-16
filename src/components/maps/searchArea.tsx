import React from 'react';
import { Source, Layer } from 'react-map-gl';

interface SearchAreaProps {
  data: GeoJSON.Feature<GeoJSON.Geometry>;
}

function SearchArea(props: SearchAreaProps) {
  return (
    <Source id="polygonSource" type="geojson" data={props.data}>
      <Layer
        id="polygonLayer"
        type="fill"
        paint={{
          'fill-color': 'purple',
          'fill-opacity': 0.3,
        }}
      />
    </Source>
  );
}

export default SearchArea;
