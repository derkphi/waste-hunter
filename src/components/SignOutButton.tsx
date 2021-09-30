import React from 'react';
import { auth } from '../firebase/config';
import Button from '@mui/material/Button';
import { Routes } from './customRoute';
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const SignOutButton = () => {
  let history = useHistory();

  const signOut = async () => {
    try {
      if (auth) {
        await auth.signOut();
        history.push(Routes.home);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Button color="secondary" variant="contained" endIcon={<ExitToAppIcon />} onClick={() => signOut()}>
      Logout
    </Button>
  );
};

export default SignOutButton;
