import React from 'react';
import { CleanupUser } from '../../firebase/firebase_types';
import Attendee from './attendee';

interface CleanupAttendeesProps {
  cleanupUsers: CleanupUser[] | undefined;
}

function CleanupAttendees(props: CleanupAttendeesProps) {
  return (
    <>
      {props.cleanupUsers?.map((cUser) => (
        <Attendee key={cUser.uid} user={cUser} />
      ))}
    </>
  );
}

export default CleanupAttendees;
