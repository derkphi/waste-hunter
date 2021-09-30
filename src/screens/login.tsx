import React, { useState } from 'react';
import { Input, Theme, Avatar, Button, CssBaseline, Link, Grid, Box, Typography, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { auth } from '../firebase/config';
import useInput from '../hooks/useInput';
import { Routes } from '../components/customRoute';
import { useHistory } from 'react-router-dom';
import Info from '../components/info';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.bfh.ch">
        Fachhochschule Bern
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const email = useInput('');
  const password = useInput('');
  const history = useHistory();
  const [hasError, setHasError] = useState(false);

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email.value, password.value);
      history.push(Routes.home);
    } catch (error) {
      setHasError(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <div>
          <img src="../logo_transparent_background.png" alt="Logo" height="150" />
        </div>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={signUp}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input
                placeholder="Email"
                {...email}
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus={true}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                placeholder="Password"
                {...password}
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submit}>
            Login
          </Button>
          {hasError && <Info text={'Falsches Login'} />}

          <Grid container justifyContent="flex-end">
            <Grid item></Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
