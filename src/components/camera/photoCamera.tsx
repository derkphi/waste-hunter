import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Button, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from '@material-ui/icons/PhotoCameraRounded';
import { projectStorage, database } from '../../firebase/config';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    textAlign: 'center',
  },
  imgBox: {
    maxWidth: '90%',
    maxHeight: '90%',
    margin: '10px',
  },
  img: {
    height: 'inherit',
    maxWidth: 'inherit',
  },
  input: {
    display: 'none',
  },
  main: {
    position: 'absolute',
    zIndex: 2000,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#FFF',
  },
  camera: { position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 10, textAlign: 'center' },
}));

interface PhotoCameraProps {
  eventId: string;
  onClose: () => void;
}

function PhotoCamera(props: PhotoCameraProps) {
  const classes = useStyles();
  const [source, setSource] = useState('');
  const [file, setFile] = useState<File>();
  const [position, setPosition] = useState<GeolocationPosition>();

  const handleCapture = (target: EventTarget & HTMLInputElement) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
        setFile(file);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((geoPos: GeolocationPosition) => {
            setPosition(geoPos);
          });
        }
      }
    }
  };

  const handleSave = async () => {
    if (file) {
      try {
        const storageRef = projectStorage.ref(file.name);
        await storageRef.put(file);

        const url = await storageRef.getDownloadURL();
        const created = Date.now();
        const { longitude, latitude } = position?.coords || {};
        database.ref(`events/${props.eventId}/photos`).push({ url, longitude, latitude, created });
        props.onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <main className={classes.main}>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" color="textPrimary" component="h2" gutterBottom>
              Bild hinzufügen
            </Typography>
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCameraRoundedIcon fontSize="large" color="primary" />
              </IconButton>
            </label>

            {source && (
              <Box display="flex" justifyContent="center" border={0} className={classes.imgBox}>
                <img src={source} alt={'snap'} className={classes.img}></img>
              </Box>
            )}
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              capture="environment"
              onChange={(e) => handleCapture(e.target)}
            />

            <Button color="secondary" variant="contained" onClick={() => props.onClose()} style={{ marginRight: 10 }}>
              Abbrechen
            </Button>

            <Button
              color="primary"
              variant="contained"
              disabled={!file}
              onClick={() => {
                handleSave();
              }}
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}
export default PhotoCamera;
