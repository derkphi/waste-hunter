import React from "react";
import {authFirebase} from "../firebase/config";
import Button from "@material-ui/core/Button";


const SignOutButton =()=> {
    const firebaseInstance=authFirebase;

    const signOut=async()=>{
        try{
            if (firebaseInstance){
                await firebaseInstance.signOut();
                alert('Successfully signed out!');
            }
        } catch(error){
            console.log('error',error)
        }
    };

    return(

    <Button variant="outlined" color="secondary" onClick={()=>signOut()}>Sign out</Button>
)
};

export default SignOutButton;

