import length from '@turf/length';
import distance from '@turf/distance';

export function getGeoJsonFromPolygon(points: Array<[number, number]>): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [points],
    },
  };
}

export function getPolygonFromGeoJson(geoArea: GeoJSON.Feature<GeoJSON.Polygon> | undefined): Array<[number, number]> {
  const coordinates = geoArea?.geometry?.coordinates;
  if (coordinates) {
    if (Array.isArray(coordinates)) {
      if (Array.isArray(coordinates[0])) {
        return coordinates[0].map((item) => [item[0], item[1]]);
      }
    }
  }
  return [];
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

export function getCleanupRouteDistance(route?: { [key: string]: number[] }): number {
  return route ? length(getGeoJsonLineFromRoute(route)) : 0;
}

export function getGeoPositionDistance(from: GeolocationPosition, to: GeolocationPosition): number {
  return distance([from.coords.longitude, from.coords.latitude], [to.coords.longitude, to.coords.latitude]);
}
