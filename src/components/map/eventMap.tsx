import StaticMap from './staticMap';
import SearchArea from './searchArea';
import MeetingPoint from './meetingPoint';
import { CleanupUser, EventWithId } from '../../firebase/types';
import CleanupMap from './cleanupMap';
import { useState } from 'react';
import { Button, Dialog, makeStyles } from '@material-ui/core';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import CloseIcon from '@material-ui/icons/Close';
import WalkPathsCleanup from './walkPathsCleanup';

const useStyles = makeStyles({
  zoomButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    minWidth: 0,
  },
});

interface EventMapProps {
  event: EventWithId;
  cleanups?: CleanupUser[];
  children?: React.ReactNode;
}

const EventMap: React.FunctionComponent<EventMapProps> = ({ event, cleanups, children }) => {
  const classes = useStyles();
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <StaticMap viewport={event.position}>
        {event.meetingPoint && (
          <MeetingPoint longitude={event.meetingPoint.longitude} latitude={event.meetingPoint.latitude} />
        )}
        {event.searchArea && <SearchArea data={event.searchArea} />}
        {cleanups && <WalkPathsCleanup cleanupUsers={cleanups} />}
        {children}
        <Button
          onClick={() => setShowMap(!showMap)}
          color="secondary"
          variant="contained"
          className={classes.zoomButton}
        >
          <ZoomOutMapIcon />
        </Button>
      </StaticMap>
      <Dialog open={showMap} fullScreen onClose={() => setShowMap(!showMap)}>
        <CleanupMap event={cleanups ? event : { ...event, photos: undefined }} cleanups={cleanups}>
          <Button
            onClick={() => setShowMap(!showMap)}
            color="primary"
            variant="contained"
            className={classes.zoomButton}
          >
            <CloseIcon />
          </Button>
        </CleanupMap>
      </Dialog>
    </>
  );
};

export default EventMap;
