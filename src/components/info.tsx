import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '20px',
      marginBottom: '20px',
    },
  })
);

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
