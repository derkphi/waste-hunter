export interface PositionType {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MeetingPoint {
  longitude: number;
  latitude: number;
}

export interface EventType {
  anlass: string;
  datum: string;
  ort: string;
  position: PositionType;
  zeit: string;
  searchArea?: GeoJSON.Feature<GeoJSON.Geometry>;
  meetingPoint?: MeetingPoint;
  registrations?: { [uid: string]: { email: string; added: number } };
}

export interface EventWithId extends EventType {
  id: string;
}
