import BasicMap from './basicMap';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';
import { EventWithId } from '../../common/firebase_types';

interface EventMapProps {
  event: EventWithId;
}

function EventMap(props: EventMapProps) {
  return (
    <BasicMap viewport={props.event.position}>
      {props.event.searchArea && <SearchArea data={props.event.searchArea} />}
      {props.event.meetingPoint && (
        <MeetingPoint longitude={props.event.meetingPoint.longitude} latitude={props.event.meetingPoint.latitude} />
      )}
    </BasicMap>
  );
}

export default EventMap;
