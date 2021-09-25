import StaticMap from './staticMap';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';
import { EventWithId } from '../../firebase/firebase_types';

interface EventMapProps {
  event: EventWithId;
}

const EventMap: React.FunctionComponent<EventMapProps> = (props) => {
  return (
    <StaticMap viewport={props.event.position}>
      <>
        {props.event.meetingPoint && (
          <MeetingPoint longitude={props.event.meetingPoint.longitude} latitude={props.event.meetingPoint.latitude} />
        )}
        {props.event.searchArea && <SearchArea data={props.event.searchArea} />}
        {props.children}
      </>
    </StaticMap>
  );
};

export default EventMap;
