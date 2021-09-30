import React from 'react';
import { Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    marginTop: '20px',
    marginBottom: '20px',
  },
});

interface InfoProps {
  text: string;
}

function Info(props: InfoProps) {
  const classes = useStyles();
  return (
    <Alert className={classes.root} severity="info">
      {props.text}
    </Alert>
  );
}

export default Info;
