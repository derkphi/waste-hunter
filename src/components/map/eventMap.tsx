import StaticMap from './staticMap';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';
import { CleanupUser, EventWithId } from '../../firebase/types';
import CleanupMap from './cleanupMap';
import { useState } from 'react';
import { Button, Dialog, IconButton } from '@material-ui/core';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import { database } from '../../firebase/config';

interface EventMapProps {
  event: EventWithId;
  children?: React.ReactNode;
}

const EventMap: React.FunctionComponent<EventMapProps> = ({ event, children }) => {
  const [showMap, setShowMap] = useState(false);
  const [cleanups, setCleanups] = useState<CleanupUser[]>();

  const handleShowMap = () => {
    if (Date.parse(`${event.datum}T${event.zeit}`) < Date.now())
      database
        .ref(`cleanups/${event.id}`)
        .get()
        .then((d) => d.exists() && setCleanups(Object.values(d.val())));
    setShowMap(true);
  };

  return (
    <>
      <StaticMap viewport={event.position}>
        {event.meetingPoint && (
          <MeetingPoint longitude={event.meetingPoint.longitude} latitude={event.meetingPoint.latitude} />
        )}
        {event.searchArea && <SearchArea data={event.searchArea} />}
        {children}
        <IconButton color="primary" onClick={handleShowMap} style={{ position: 'absolute', top: 10, right: 10 }}>
          <ZoomOutMapIcon />
        </IconButton>
      </StaticMap>
      {showMap && (
        <Dialog open={showMap} fullScreen onClose={() => setShowMap(false)}>
          <CleanupMap event={cleanups ? event : { ...event, photos: undefined }} cleanups={cleanups}>
            <footer
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                padding: 10,
                textAlign: 'center',
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setShowMap(false);
                }}
              >
                Beenden
              </Button>
            </footer>
          </CleanupMap>
        </Dialog>
      )}
    </>
  );
};

export default EventMap;
