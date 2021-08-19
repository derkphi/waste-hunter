import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {authFirebase} from "../firebase/config";
import useInput from "../hooks/useInput";
import {createTheme, Input,ThemeProvider} from "@material-ui/core";


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
const theme = createTheme({
    palette: {
        primary: {
            light:'#528777',
            main: '#276955',
            dark:'#1b493b',
        },
        secondary: {
            light:'#67b7a3',
            main: '#41a58d',
            dark:'#2d7362',
        },
    },
});



const useStyles = makeStyles(() => ({
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
    const email=useInput('');
    const password=useInput('');
    const firebaseInstance=authFirebase;


    const signUp=async (event:React.FormEvent)=> {
        event.preventDefault();

        try {
            if (firebaseInstance) {
                const user = await firebaseInstance.signInWithEmailAndPassword(email.value, password.value)
                console.log('user ', user)
                alert('Welcome back')
            }
        } catch (error) {
            console.log('error', error);
            alert(error.message);
        }

    };

    return (
        <ThemeProvider theme={theme}>

            <Container component="main" maxWidth="xs">

                <CssBaseline />

                <div className={classes.paper}>
<div>
    <img src="../android-chrome-512x512.png" alt="Logo" height="200" width="200
    "/>
</div>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login




                    </Typography>
                    <form className={classes.form} noValidate onSubmit={signUp}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input
                                    placeholder='Email'
                                    {...email}
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    placeholder='Password'
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>

                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </ThemeProvider>
    );
}



