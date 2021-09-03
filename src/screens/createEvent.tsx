import React,{useState} from 'react';
import {TextField, Typography, makeStyles,FormLabel,Button} from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {Container} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { Routes } from '../components/customRoute';
import EventMap from '../components/eventMap';

const useStyles= makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: 'block'
    }
})

function CreateEvent(){

    const classes=useStyles();
    const history = useHistory()
    const [anlass, setAnlass] = useState('')
    const [ort, setOrt] = useState('')
    const [datum, setDatum] = useState('')
   const [zeit, setzeit] = useState('')
    const [anlasserror, setAnlasserror] = useState(false)

    const [orterror, setOrterror] = useState(false)
    const [datumerror, setDatumerror] = useState(false)
        const [zeiterror, setzeiterror] = useState(false)


    const handleSubmit = (e:any) => {
        e.preventDefault()
        setAnlasserror(false)
        setOrterror(false)
        setDatumerror(false)
        setzeiterror(false)

        if (anlass === '') {
        setAnlasserror(true)
        }
       if (ort === '') {
        setOrterror(true)
        }
       if (datum ===''){
           setDatumerror(true)
       }
        if (zeit ===''){
            setzeiterror(true)
        }
        if (anlass && ort) {
            fetch('https://waste-hunter-default-rtdb.europe-west1.firebasedatabase.app/events.json', {
                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({ anlass, ort,datum,zeit })
            }).then(() => history.push(Routes.calendar))
        }
    }




    return(
        <Container maxWidth="sm">
        <Typography
            variant="h4"
            color="textPrimary"
            component="h2"
            gutterBottom
        >
            Erfasse einen Event
        </Typography>

        <div style={{width: '100%', height: '300px' }}>
<EventMap />
</div>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <FormLabel>Anlass</FormLabel>
<TextField
    className={classes.field}
    onChange={(e) => setAnlass(e.target.value)}
    autoFocus={true}
    variant="outlined"
    color="secondary"
    fullWidth
    required
    error={anlasserror}
>

</TextField>
                <FormLabel>Ort</FormLabel>

                <TextField
                    className={classes.field}
                    onChange={(e) => setOrt(e.target.value)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    required
                    error={orterror}>
                    <FormLabel>Datum</FormLabel>
                </TextField>
                <FormLabel>Datum</FormLabel>
            <TextField
                className={classes.field}
                onChange={(e) => setDatum(e.target.value)}
                type="date"
                variant="outlined"
                color="secondary"
                fullWidth
                required
                error={datumerror}>

            </TextField>
                <FormLabel>Zeit</FormLabel>
                <TextField
                    className={classes.field}
                    onChange={(e) => setzeit(e.target.value)}
                    type="time"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    required
                    error={zeiterror}>

                </TextField>
                <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    endIcon={<KeyboardArrowRightIcon />}>
                    Submit
                </Button>
            </form>
        </Container>

    )
}
export default CreateEvent;
