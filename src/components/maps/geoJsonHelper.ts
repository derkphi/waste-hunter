export function getGeoJsonPolygon(points: Array<[number, number]>): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [points],
    },
  };
}

export function getGeoJsonLineFromRoute(route: { [key: string]: number[] }): GeoJSON.Feature<GeoJSON.Geometry> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: Object.values(route).map((p) => p.slice(0, 2)),
    },
  };
}

export function getGeoJsonLine(points: Array<[number, number]>): GeoJSON.Feature<GeoJSON.Geometry> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: points,
    },
  };
}
