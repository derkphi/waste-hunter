import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@material-ui/core';
import Webcam from 'react-webcam';
import { makeStyles } from '@material-ui/core/styles';
import { projectStorage } from '../../firebase/config';

const useStyles = makeStyles((theme) => ({
  camerabutton: { left: 20, bottom: 100, padding: 10 },
}));

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: 'user',
};

export default function Cameracomponent() {
  const classes = useStyles();
  const [image, setImage] = useState('');
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    // @ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    projectStorage.ref(`/image/${image}`).put(imageSrc);
  }, [image]);

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image === '' ? (
          <Webcam
            audio={false}
            height={window.innerHeight}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={window.innerWidth}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} alt="Eventfoto" />
        )}
      </div>
      <div className="ImageCam">
        {image !== '' ? (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              setImage('');
            }}
            className={classes.camerabutton}
          >
            Neues Bild
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className={classes.camerabutton}
          >
            Bild schiessen
          </Button>
        )}
      </div>
    </div>
  );
}
