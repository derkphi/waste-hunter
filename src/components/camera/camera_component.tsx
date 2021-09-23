import React, { useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {IconButton, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import {projectStorage,database} from "../../firebase/config";


const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        textAlign: 'center',
    },
    imgBox: {
        maxWidth: "90%",
        maxHeight: "90%",
        margin: "10px"
    },
    img: {
        height: "inherit",
        maxWidth: "inherit",
    },
    input: {
        display: "none"
    }
}));

function Cameracomponent() {

    const classes = useStyles();
    const [source, setSource] = useState("");

    const handleCapture = (target: EventTarget & HTMLInputElement) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                const newUrl = URL.createObjectURL(file);
                setSource(newUrl);
                const storageRef=projectStorage.ref(file.name)
                const createdAt=Date();

                storageRef.put(file);
                database.ref(`images`).push(createdAt);




                }
            }
        };

function sendimage (){

}

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h4" color="textPrimary" component="h2" gutterBottom>
                         Bild hinzufügen
                    </Typography>
                    <label htmlFor="icon-button-file">

                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                        >
                            <PhotoCameraRoundedIcon fontSize="large" color="primary" />
                        </IconButton>
                    </label>
                    {source &&
                    <Box display="flex" justifyContent="center" border={0} className={classes.imgBox}>
                        <img src={source} alt={"snap"} className={classes.img}></img>
                    </Box>}
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        capture="environment"
                        onChange={(e) => handleCapture(e.target)}
                    />

                </Grid>
            </Grid>
        </div>
    );
}
export default Cameracomponent;


