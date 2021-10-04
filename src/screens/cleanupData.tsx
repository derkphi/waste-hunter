import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DynamicMap from '../components/map/dynamicMap';
import SearchArea from '../components/map/searchArea';
import MeetingPoint from '../components/map/meetingPoint';
import { getGeoJsonLine } from '../components/map/geoJsonHelper';
import { database } from '../firebase/config';
import firebase from 'firebase/app';
import { MeetingPointType, CleanupUser, UserWithId } from '../firebase/types';
import { Box, Typography } from '@material-ui/core';
import distance from '@turf/distance';
import length from '@turf/length';
import StatisticItem from '../components/report/statisticItem';
import WalkPath from '../components/map/walkPath';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import WalkPathsCleanup from '../components/map/walkPathsCleanup';

const fallbackViewport = {
  latitude: 46.8131873,
  longitude: 8.22421,
  zoom: 7,
};

const sourceId = 0;
const walkSpeed = 5; // [km/h]

function GenData() {
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [searchArea, setSearchArea] = useState<GeoJSON.Feature<GeoJSON.Polygon> | undefined>(undefined);
  const [viewport, setViewport] = useState(fallbackViewport);
  const [draw, setDraw] = useState(false);
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [walkDist, setWalkDist] = useState(0);
  const [walkTime, setWalkTime] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState<Array<UserWithId>>([]);
  const [meetingPoint, setMeetingPoint] = useState<MeetingPointType | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const [cleanupUsers, setCleanupUsers] = useState<CleanupUser[]>();

  useEffect(() => {
    const ref = database.ref(`cleanups/${id}`);
    const cb = (d: firebase.database.DataSnapshot) => {
      const cleanupData = d.val();
      if (cleanupData) {
        setCleanupUsers(Object.values(d.val()));
      }
    };
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [id]);

  useEffect(() => {
    database
      .ref(`users`)
      .get()
      .then((data) => {
        setUsers(Object.entries(data.val() as { [id: string]: UserWithId }).map(([id, user]) => ({ ...user, id })));
      });
  }, []);

  useEffect(() => {
    if (id) {
      database
        .ref(`events/${id}`)
        .get()
        .then((d) => {
          setEventDate(d.val().datum);
          setEventTime(d.val().zeit);
          setViewport(d.val().position);
          setSearchArea(d.val().searchArea);
          setMeetingPoint(d.val().meetingPoint);
        });
    }
  }, [id]);

  useEffect(() => {
    setWalkDist(length(getGeoJsonLine(route)));
  }, [route]);

  useEffect(() => {
    setWalkTime(Math.round((1000 * walkDist) / (walkSpeed / 3.6) / 60));
  }, [walkDist]);

  function handleMapDoubleClick(longitude: number, latitude: number) {
    if (!draw) {
      //setSourceId(sourceId + 1);
      setRoute([[longitude, latitude]]);
    }
    setDraw(!draw);
  }

  function handleMapClick(_longitude: number, _latitude: number) {
    setDraw(!draw);
  }

  function handleMapMove(longitude: number, latitude: number) {
    if (draw) {
      if (route.length > 0) {
        if (distance([longitude, latitude], route[route.length - 1]) > 5e-3) {
          setRoute([...route, [longitude, latitude]]);
        }
      } else {
        setRoute([[longitude, latitude]]);
      }
    }
  }

  function drawCursor() {
    if (draw) {
      return 'crosshair';
    }
    return undefined;
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const user = users ? users.find((u: UserWithId) => u.email === userEmail) : undefined;
    if (user) {
      const startTime = Date.parse(eventDate + ' ' + eventTime);
      const endTime = startTime + walkTime * 60e3;
      // Register user for event
      database.ref(`events/${id}/registrations/${user.id}`).set({
        email: user.email,
        added: Date.now() < startTime ? Date.now() : startTime,
      });

      const min = 20; // Liter
      const max = 110; // Liter
      const collected = Math.round(Math.random() * (max - min) + min);

      // Write cleanup user data
      database.ref(`cleanups/${id}/${user.id}`).update({
        uid: user.id,
        email: user.email,
        start: startTime,
        end: endTime,
        distance: walkDist,
        collected,
      });
      database.ref(`events/${id}/cleanup/${user.id}`).set({
        uid: user.id,
        email: user.email,
        start: startTime,
        end: endTime,
        distance: walkDist,
        collected,
      });

      // Write walk path
      const routeRef = database.ref(`cleanups/${id}/${user.id}/route`);
      routeRef.remove();

      let time = startTime;
      route.forEach((_item, idx) => {
        if (idx === 0) {
          routeRef.push([route[0][0], route[0][1], startTime]);
        } else {
          const dist = distance([route[idx][0], route[idx][1]], [route[idx - 1][0], route[idx - 1][1]]) * 1000;
          const timeDiff = (dist / (walkSpeed / 3.6)) * 1000;
          time = time + timeDiff;
          routeRef.push([route[idx][0], route[idx][1], time]);
        }
      });
      console.log('Cleanup/event uid: ' + id);
      console.log(user.email + ' uid: ' + user.id);
      console.log('Route num points: ' + route.length);
      console.log('Route length: ' + Math.round(walkDist * 1000) + ' m');
      console.log('Collected: ', collected + ' l');

      setRoute([]);
    }
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography paragraph>
        Doppelklick: Linie zeichnen starten / beenden. Klick: Linie zeichnen unterbrechen (z.B. für Karte schieben und
        zoomen)
      </Typography>
      <Box style={{ width: '100%', height: '70vh' }}>
        <DynamicMap
          viewport={viewport}
          onDoubleClick={handleMapDoubleClick}
          onClick={handleMapClick}
          onMove={handleMapMove}
          onViewportChange={(vp) => setViewport(vp)}
          cursorOverride={drawCursor}
        >
          {searchArea && <SearchArea data={searchArea} />}
          {meetingPoint && <MeetingPoint longitude={meetingPoint.longitude} latitude={meetingPoint.latitude} />}
          {route.length > 1 && <WalkPath color="red" uid={sourceId.toString()} walkPath={getGeoJsonLine(route)} />}
          <WalkPathsCleanup cleanupUsers={cleanupUsers} />
        </DynamicMap>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
        <Box style={{ display: 'flex' }}>
          <StatisticItem label={'Suchzeit'} value={walkTime} unit={'Min.'} color="#f7eeb3" />
          <StatisticItem label={'Strecke'} value={Math.round(1000 * walkDist)} unit={'Meter'} color="#bbdeeb" />
        </Box>
        <Box style={{ marginTop: '5px', marginLeft: '40px' }}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Benutzer</FormLabel>
              <RadioGroup
                aria-label="user"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                name="radio-buttons-group"
              >
                {users.map((user) => (
                  <FormControlLabel key={user.id} value={user.email} control={<Radio />} label={user.email} />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              disabled={route.length === 0}
              type="submit"
              color="secondary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
            >
              Speichern
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default GenData;
