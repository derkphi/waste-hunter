import React, {useRef,useEffect, useState} from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CameraAltRounded} from "@mui/icons-material";
import SaveIcon from '@mui/icons-material/Save';
import {projectStorage,projectFirestore,timestamp} from "../../firebase/config";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        textAlign: 'center',
    },
    picture: {
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
}));

function Cameracomponent() {
    const videoRef=useRef();
    const photoRef=useRef();
    const [hasPhoto, setHasPhoto]=useState("false");



    const getVideo= ()=>{
        navigator.mediaDevices.getUserMedia({video: {width:440,height: 880        }
        })
            .then(stream=>{
                let video=videoRef.current;
                video.srcObject=stream;
                video.play();
            })
            .catch (err=>{
                console.error(err);
            })
    }
    useEffect(()=>{getVideo();
    },[videoRef])

    const takePhoto=()=>{
        const width=440;
        const height =width/(1/2);
        let video=videoRef.current;
        let photo=photoRef.current;

        photo.width=width;
        photo.height=height;

        let ctx=photo.getContext('2d');
        ctx.drawImage(video,0,0,width,
            height);
        setHasPhoto(true);

    }

    const closePhoto=()=>{
        let photo=photoRef.current;
        let ctx=photo.getContext('2d');

        ctx.clearRect(0,0,photo.width,photo.height);

        setHasPhoto(false);
    }

    const sendPhoto=()=> {
        let photo=photoRef.current;



        if(photo == null)
            return;
        projectStorage.ref(`/image/${photo.name}`).put(photo)
            .on("state_changed" , alert("success") , alert);
    }


if (!hasPhoto){

    return (

        <div className="picture">
            <div className="camera">

                <video ref={videoRef}>
                </video>

                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={takePhoto}
                    >
                        <CameraAltRounded fontSize="large" color="primary"/>
                    </IconButton>
                </label>
            </div>
            <div className={'result' +(hasPhoto?'hasPhoto':'')}>
                <canvas ref={photoRef}></canvas>
                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={closePhoto}
                    >
                        <CameraAltRounded fontSize="large" color="primary"/>
                    </IconButton>
                </label>

            </div>
        </div>
    );
}
else {
    return (


        <>
                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={setHasPhoto(false)}
                    >
                        <CameraAltRounded fontSize="large" color="primary"/>
                    </IconButton>
                </label>

            <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={closePhoto}
                    >
                        <CameraAltRounded fontSize="large" color="primary"/>
                    </IconButton>
                </label>
            </div>
</>


    );

}
}


export default Cameracomponent;
