import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import User from './user';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  item: {
    marginRight: '40px',
    marginBottom: '10px',
    minWidth: '200px',
  },
});

interface UserGroupProps {
  userUids: string[] | undefined;
}

function UserGroup(props: UserGroupProps) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {props.userUids?.map((userUid) => (
        <Box key={userUid} className={classes.item}>
          <User uid={userUid} />
        </Box>
      ))}
    </Box>
  );
}

export default UserGroup;
