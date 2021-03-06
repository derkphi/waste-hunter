import React, { useEffect, useState } from 'react';
import { Button, Chip, Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PlayCircleFilledOutlinedIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import CloseIcon from '@material-ui/icons/Close';
import { database } from '../firebase/config';
import { EventWithId } from '../firebase/types';

interface DemoValue {
  collected: number;
  distance: number;
  route: number[][];
  uid: string;
  email: string;
}

interface DemoData {
  [name: string]: DemoValue;
}

interface Demo extends DemoValue {
  name: string;
  time: number;
  play?: { start: number; time: number };
}

interface DemoCleanupsProps {
  event: EventWithId;
  className?: string;
}

export default function DemoCleanups({ event, className }: DemoCleanupsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [demos, setDemos] = useState<Demo[]>([]);

  useEffect(() => {
    if (!showDialog || demos[0]) return;
    database
      .ref('demoCleanups')
      .get()
      .then((ds) => {
        if (!ds.exists()) return;
        setDemos(
          Object.entries(ds.val() as DemoData).map(([name, cleanup]) => {
            const route = Object.values(cleanup.route);
            const diff = event.meetingPoint
              ? [route[0][0] - event.meetingPoint.longitude, route[0][1] - event.meetingPoint.latitude, route[0][2]]
              : [0, 0, route[0][2]];
            return {
              ...cleanup,
              name,
              route: [...route.map((r) => [r[0] - diff[0], r[1] - diff[1], r[2] - diff[2]])],
              time: route.pop()![2] - route[0][2],
              // uid: `demo-cleanups-${name.replace(/\W+/g, '')}`,
            };
          })
        );
      });
  }, [showDialog, demos, event]);

  useEffect(() => {
    if (!demos || !demos.some((d) => d.play)) return;
    const timeout = setTimeout(() => {
      demos.forEach((demo) => {
        if (!demo.play) return;
        const time = Date.now() - demo.play.start;
        demo.route
          .filter((r) => r[2] >= demo.play!.time && r[2] < time)
          .forEach((r) => {
            // console.log('push', demo.uid, r[0], r[1], Date.now());
            database.ref(`cleanups/${event.id}/${demo.uid}/route`).push([r[0], r[1], Date.now()]);
          });
        demo.play.time = time;
      });
      setDemos([...demos]);
    }, 1e3);
    return () => clearTimeout(timeout);
  }, [demos, event]);

  const handlePlay = (demo: Demo) => {
    demo.play = demo.play ? undefined : { start: Date.now(), time: 0 };
    if (!demo.play) return;
    // console.log('set', demo.uid, demo.email);
    database.ref(`cleanups/${event.id}/${demo.uid}`).set({
      uid: demo.uid,
      email: demo.email,
    });
    setDemos([...demos]);
  };

  // console.log(demos);
  return (
    <>
      <IconButton className={className} onClick={() => setShowDialog(true)}>
        {demos.some((d) => d.play) ? <PlayCircleFilledOutlinedIcon color="primary" /> : <PlayCircleOutlineIcon />}
      </IconButton>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} style={{ zIndex: 3000 }}>
        <DialogTitle>
          Demo Cleanups
          <IconButton style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setShowDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {demos.map((demo) => (
            <Button
              fullWidth
              color="primary"
              startIcon={demo.play ? <PlayCircleFilledOutlinedIcon /> : <PlayCircleOutlineIcon />}
              onClick={() => handlePlay(demo)}
            >
              {demo.name} ({(demo.time / 1e3).toFixed()}s, {demo.distance.toFixed(3)}km, {demo.collected.toFixed()}l)
              {demo.play && (
                <Chip
                  color="primary"
                  size="small"
                  icon={<DirectionsWalkIcon />}
                  label={`${((demo.time - demo.play.time) / 1e3).toFixed()}`}
                  style={{ marginLeft: '1em' }}
                />
              )}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
