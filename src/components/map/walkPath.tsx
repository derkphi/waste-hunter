import React from 'react';
import { Layer, Source } from 'react-map-gl';

interface WalkPathProps {
  uid: string;
  walkPath: GeoJSON.Feature<GeoJSON.Geometry>;
}

function WalkPath(props: WalkPathProps) {
  return (
    <>
      <Source id={`source-${props.uid}`} type="geojson" data={props.walkPath} />
      <Layer
        id={`layer-${props.uid}`}
        type="line"
        source={`source-${props.uid}`}
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
  );
}

export default WalkPath;
