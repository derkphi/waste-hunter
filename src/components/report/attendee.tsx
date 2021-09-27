import React, { useEffect, useState } from 'react';
import { CleanupUser, UserWithId } from '../../firebase/firebase_types';
import { database } from '../../firebase/config';
import { Typography } from '@material-ui/core';

interface AttendeeProps {
  user: CleanupUser;
}

function Attendee(props: AttendeeProps) {
  const [user, setUser] = useState<UserWithId | undefined>(undefined);

  useEffect(() => {
    database
      .ref(`users/${props.user.uid}`)
      .get()
      .then((data) => {
        const userData = data.val();
        if (userData) {
          setUser({ ...data.val(), id: props.user.uid });
        } else {
          setUser({ firstName: props.user.email || '?', lastName: '', icon: 0, email: '', id: props.user.uid });
        }
      });
  }, [props.user]);

  return (
    <>
      {user && (
        <Typography key={user.id}>
          {user.firstName} {user.lastName}
        </Typography>
      )}
    </>
  );
}

export default Attendee;
