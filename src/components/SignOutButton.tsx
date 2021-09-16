import React from "react";
import {authFirebase} from "../firebase/config";
import Button from "@material-ui/core/Button";
import {Routes} from "./customRoute";
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const SignOutButton =()=> {
    const firebaseInstance=authFirebase;
    let history = useHistory();

    const signOut=async()=>{
        try{
            if (firebaseInstance){
                await firebaseInstance.signOut();
                history.push(Routes.home);
            }
        } catch(error){
            console.log('error',error)
        }
    };

    return(

    <Button
        color="secondary"
        variant="contained"
        endIcon={<ExitToAppIcon />}
        onClick={()=>signOut()}>
        Logout
    </Button>
)
};

export default SignOutButton;

