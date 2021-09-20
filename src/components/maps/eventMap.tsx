import StaticMap from './staticMap';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';
import { EventWithId } from '../../common/firebase_types';

interface EventMapProps {
  event: EventWithId;
}

function EventMap(props: EventMapProps) {
  return (
    <StaticMap viewport={props.event.position}>
      <>
        {props.event.meetingPoint && (
          <MeetingPoint longitude={props.event.meetingPoint.longitude} latitude={props.event.meetingPoint.latitude} />
        )}
        {props.event.searchArea && <SearchArea data={props.event.searchArea} />}
      </>
    </StaticMap>
  );
}

export default EventMap;
