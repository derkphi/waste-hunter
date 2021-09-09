export interface PositionType {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface EventType {
  anlass: string;
  datum: string;
  ort: string;
  position: PositionType;
  zeit: string;
}
