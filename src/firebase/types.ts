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
  photos?: { [id: string]: { url: string; longitude?: number; latitude?: number } };
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
  email: string;
  start: number;
  route?: { [key: string]: [longitude: number, latitude: number, timestamp: number] };
  end?: number;
  collected?: number;
  distance?: number;
}

export interface User {
  lastName: string;
  firstName: string;
  email: string;
  icon: number;
}

export interface UserWithId extends User {
  id: string;
}
