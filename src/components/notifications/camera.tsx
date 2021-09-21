import React, {ChangeEvent, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UploadIcon from '@mui/icons-material/Upload';
import {CameraAltRounded} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        textAlign: 'center',
    },
    imgBox: {
        maxWidth: "80%",
        maxHeight: "80%",
        margin: "10px"
    },
    img: {
        height: "inherit",
        maxWidth: "inherit",
    },
    input: {
        display: "none"
    }
}));function Camera() {
    const classes = useStyles();
    const [source, setSource] = useState("");
    const handleCapture = (target:any) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                const newUrl = URL.createObjectURL(file);
                setSource(newUrl);
            }
        }
    };return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <h5>Capture your image</h5>
                    {source &&
                    <Box display="flex" justifyContent="center" border={1} className={classes.imgBox}>
                        <img src={source} alt={"snap"} className={classes.img}></img>
                    </Box>}
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        capture="environment"
                        onChange={(e:ChangeEvent) => handleCapture(e.target)}
                    />

                    <label htmlFor="icon-button-file">
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                        >
                            <CameraAltRounded fontSize="large" color="primary"/>
                            </IconButton>
                            </label>
                            <label htmlFor="icon-button-file">
                            <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                        >

                            <UploadIcon fontSize="large" color="primary" />
                        </IconButton>
                    </label>
                </Grid>
            </Grid>
        </div>
    );
}
export default Camera;
