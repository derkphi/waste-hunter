export interface PositionType {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MeetingPointType {
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
  meetingPoint?: MeetingPointType;
  registrations?: { [uid: string]: { email: string; added: number } };
  cleanup?: {
    [uid: string]: {
      uid: string;
      email: string;
      start: number;
      end: number;
      distance: number;
      collected: number;
    };
  };
}

export interface EventWithId extends EventType {
  id: string;
}

export interface CleanupUser {
  uid: string;
  email: string | null;
  start: number;
  route?: { [key: string]: number[] }; // [longitude, latitude, timestamp]
  end?: number;
  collected?: number;
  distance?: number;
}
