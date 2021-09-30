import React, { useState } from 'react';
import { Grid, Box, Button, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { storage, database } from '../../firebase/config';

const useStyles = makeStyles({
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
});

interface CameracomponentProps {
  eventId: string;
  onClose: () => void;
}

function Cameracomponent(props: CameracomponentProps) {
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
        const storageRef = storage.ref(file.name);
        await storageRef.put(file);

        const url = await storageRef.getDownloadURL();
        const createdAt = Date();
        const { longitude, latitude } = position?.coords || {};
        database.ref(`events/${props.eventId}/photos`).push({ url, longitude, latitude, createdAt });
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
            <Button color="secondary" variant="contained" onClick={() => props.onClose()}>
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
export default Cameracomponent;
