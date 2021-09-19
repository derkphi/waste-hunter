import React from 'react';
import { Marker } from 'react-map-gl';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { makeStyles } from '@material-ui/core/styles';

interface MettingPointProps {
  longitude: number;
  latitude: number;
  onDragStart?: () => void;
  onDragEnd?: (longitude: number, latitude: number) => void;
}

const useStyles = makeStyles({
  iconStart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -100%)',
  },
});

function MeetingPoint(props: MettingPointProps) {
  const classes = useStyles();
  const draggable = props.onDragEnd ? true : false;
  return (
    <Marker
      longitude={props.longitude}
      latitude={props.latitude}
      draggable={draggable}
      onDragStart={props.onDragStart}
      onDragEnd={(e) => {
        props.onDragEnd && props.onDragEnd(e.lngLat[0], e.lngLat[1]);
      }}
    >
      <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
    </Marker>
  );
}

export default MeetingPoint;
